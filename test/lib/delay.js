
module.exports = function (res, t, n) {
  n = n == null ? t : n
  return function (cb) {
    setTimeout(function() {
      res.push(n)
      cb()
    }, t)
  }
}

