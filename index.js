var promisify = require('node-promisify')
var runCallback = promisify(require('run-callback'), -1)

exports = module.exports = function () {
  var cbs = Array.prototype.slice.call(arguments)
  return function () {
    return run(cbs)
  }
}

exports.run = run
exports.parallel = parallel

function run(cbs, args, i) {
  i = ~~i
  args = defined(args) ? args : []

  // NOTE: tasks can be pushed to `cbs` dynamically
  var cb = cbs[i]
  var ret
  if (typeof cb === 'function') {
    ++i
    ret = runCallback([cb].concat(args)).then(valid)
  } else if (Array.isArray(cb)) {
    ++i
    ret = parallel(cb, args)
  } else {
    ret = Promise.resolve([].concat(args))
  }
  return ret.then(function (res) {
    if (i < cbs.length) {
      return run(cbs, res, i)
    }
    return res
  })
}

function parallel(cbs, args) {
  args = defined(args) ? args : []
  return Promise.all(cbs.map(function (cb) {
    if (typeof cb === 'function') {
      return runCallback([cb].concat(args)).then(valid)
    }
    if (Array.isArray(cb)) {
      return run(cb, args, 0)
    }
    return Promise.resolve([].concat(args))
  }))
}

function valid(res) {
  return res.filter(defined)
}

function defined(o) {
  return typeof o !== 'undefined'
}

