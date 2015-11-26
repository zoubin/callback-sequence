var bindAsync = require('run-callback').bindAsync

var last = {}
var first = {}

exports = module.exports = function () {
  return run.bind(null, arguments)
}

exports.run = run
exports.first = first
exports.last = last

function run(things, initial, done) {
  if (arguments.length < 3) {
    if (typeof initial === 'function') {
      done = initial
      initial = null
    }
  }

  next(things, initial, done || function () {}, [], 0)
}

function next(things, initial, done, res, i) {
  if (i >= things.length) {
    return done(null, res)
  }
  bind(things[i], res, initial)(function (err, r) {
    if (err) {
      return done(err, res)
    }
    res.push(r)
    next(things, initial, done, res, ++i)
  })
}

function bind(fn, res, initial) {
  return bindAsync.apply(null, [].concat(fn).map(function (j) {
    if (j === last) {
      return res.length === 0 ? initial : res[res.length - 1]
    }
    if (j === first) {
      return initial == null ? res[0] : initial
    }
    return j
  }))
}

