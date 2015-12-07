var run = require('..').run

var res = []
run([
  function () { res.push(1) },
  [
    function (cb) {
      setTimeout(function() {
        res.push(3)
        cb()
      }, 0)
    },
    function () {
      return new Promise(function (resolve) {
        process.nextTick(function () {
          res.push(2)
          resolve()
        })
      })
    },
  ],
  function () { res.push(4) },
]
)
.then(function () {
  // [1, 2, 3, 4]
  console.log(res)
})

