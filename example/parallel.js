var Runner = require('..').Runner
var runner = Runner()

var res = []
runner.parallel([
  function () { res.push(1) },
  [
    function () {
      return Promise.resolve().then(function () {
        res.push(4)
      })
    },
    function () { res.push(5) },
  ],
  function (cb) {
    setTimeout(function() {
      res.push(3)
      cb()
    }, 0)
  },
  function (cb) {
    res.push(2)
    cb()
  },
])
.then(function () {
  // [1, 2, 4, 5, 3]
  console.log(res)
})

