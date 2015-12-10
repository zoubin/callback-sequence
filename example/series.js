var Runner = require('..').Runner
var runner = Runner()

runner.series(
  function () {
    console.log(1)
    return 1
  },
  [
    function () {
      return Promise.resolve().then(function () {
        console.log(4)
        return 4
      })
    },
    function (cb) {
      setTimeout(function() {
        console.log(3)
        cb(null, 3)
      }, 0)
    },
    function () {
      console.log(5)
      return 5
    },
  ],
  function (cb) {
    console.log(2)
    cb(null, 2)
  }
)
.then(function (res) {
  // 1
  // 5
  // 4
  // 3
  // 2
  // [ [ 1  ], [ [ 4  ], [ 3  ], [ 5  ]  ], [ 2  ]  ]
  console.log(res)
})

