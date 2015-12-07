var Runner = require('..').Runner

var runner = Runner({ input: true })

runner.thunkify(
  function (a, b) {
    // 3
    return a + b
  },
  function (sum, next) {
    process.nextTick(function () {
      // 6
      next(null, sum * 2)
    })
  },
  function (product) {
    return Promise.resolve().then(function () {
      // 7
      return product + 1
    })
  }
)(1, 2)
.then(function (res) {
  // [7]
  console.log(res)
})

