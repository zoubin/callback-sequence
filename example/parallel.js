var parallel = require('..').parallel

parallel([
  function () { console.log(1) },
  [
    function (cb) {
      setTimeout(function() {
        console.log(3)
        cb()
      }, 0)
    },
    function () {
      return new Promise(function (resolve) {
        process.nextTick(function () {
          console.log(2)
          resolve()
        })
      })
    },
  ],
  function () { console.log(4) },
]
)
.then(function () {
  console.log('DONE')
})

