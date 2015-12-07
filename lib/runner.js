var runCallback = require('run-callback')

module.exports = Runner

function Runner(opts) {
  if (!(this instanceof Runner)) {
    return new Runner(opts)
  }
  opts = opts || {}
  this.input = opts.input !== false
  this.output = opts.output !== false
}

Runner.prototype.normalizeArgs = function(args) {
  return this.input && defined(args) ? args : []
}

Runner.prototype.run = function(cb, args) {
  args = this.normalizeArgs(args)
  return runCallback.apply(null, [cb].concat(args))
}

Runner.prototype.sequence = function(cbs, args, i) {
  i = ~~i

  // NOTE: tasks can be pushed to `cbs` dynamically
  var cb = cbs[i]
  var ret
  if (typeof cb === 'function') {
    ++i
    ret = this.run(cb, args)
  } else if (Array.isArray(cb)) {
    ++i
    ret = this.parallel(cb, args)
  } else {
    ret = Promise.resolve(args)
  }

  var self = this
  return ret.then(function (res) {
    if (i < cbs.length) {
      return self.sequence(cbs, res, i)
    }
    if (self.output) return res
  })
}

Runner.prototype.parallel = function(cbs, args) {
  var self = this
  return Promise.all(cbs.map(function (cb) {
    if (typeof cb === 'function') {
      return this.run(cb, args)
    }
    if (Array.isArray(cb)) {
      return this.sequence(cb, args)
    }
    return Promise.resolve(args)
  }, this))
  .then(function (res) {
    if (self.output) return res
  })
}

Runner.prototype.thunkify = function() {
  var cbs = slice(arguments)
  var self = this
  return function () {
    return self.sequence(cbs, slice(arguments))
  }
}

function defined(o) {
  return typeof o !== 'undefined'
}

function slice(o, from, to) {
  return Array.prototype.slice.call(o, from, to)
}

