var thunkify = require('..')

var res = []
thunkify(
  function () {
    res.push(1)
  },
  function (next) {
    process.nextTick(function () {
      res.push(2)
      next()
    })
  },
  function () {
    return Promise.resolve().then(function () {
      res.push(3)
    })
  }
)()
.then(function () {
  // [1, 2, 3]
  console.log(res)
})
