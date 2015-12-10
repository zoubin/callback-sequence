var Runner = require('..').Runner
var runner = Runner()

runner.thunkify(
  function (res) {
    return res + 1
  },
  function (res) {
    return Promise.resolve()
      .then(function () {
        return res + 1
      })
  },
  function (res, next) {
    process.nextTick(function () {
      next(null, res - 1, res + 1)
    })
  }
)(1)
.then(function (res) {
  // [ 2, 4 ]
  console.log(res)
})
