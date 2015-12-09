var runCallback = require('run-callback')

module.exports = Runner

function Runner(opts) {
  if (!(this instanceof Runner)) {
    return new Runner(opts)
  }
  opts = opts || {}
  this.input = opts.input !== false
  this.output = opts.output !== false
  if (typeof opts.run === 'function') {
    this._run = opts.run
  } else {
    this._runner = runCallback.Runner(opts.run)
  }
}

Runner.prototype.normalizeArgs = function(args) {
  if (!this.input || !defined(args)) return []
  return Array.isArray(args) ? args : [args]
}

Runner.prototype.normalizeResult = function(res) {
  return this.output ? res : []
}

Runner.prototype.run = function(cb, args) {
  args = [cb].concat(args)
  return Promise.resolve(this).then(function (runner) {
    return runner._run.apply(runner, args)
  })
}

Runner.prototype._run = function(cb) {
  return this._runner.thunkify(cb)
    .apply(this._runner, slice(arguments, 1))
}

Runner.prototype.sequence = function(cbs, args, i) {
  if (!Array.isArray(cbs)) cbs = [cbs]
  args = this.normalizeArgs(args)

  i = ~~i
  var cb = cbs[i]

  // **NOTE**: tasks can be pushed to `cbs` dynamically
  if (i < cbs.length) ++i

  var ret
  if (typeof cb === 'function') {
    ret = this.run(cb, args)
  } else if (Array.isArray(cb)) {
    ret = this.parallel(cb, args)
  } else {
    ret = Promise.resolve(args)
  }

  var self = this
  return ret.then(function (res) {
    if (i < cbs.length) {
      return self.sequence(cbs, res, i)
    }
    return self.normalizeResult(res)
  })
}

Runner.prototype.parallel = function(cbs, args) {
  if (!Array.isArray(cbs)) cbs = [cbs]
  args = this.normalizeArgs(args)

  return Promise.all(cbs.map(function (cb) {
    if (typeof cb === 'function') {
      return this.run(cb, args)
    }
    if (Array.isArray(cb)) {
      return this.sequence(cb, args)
    }
    return Promise.resolve(args)
  }, this))
  .then(this.normalizeResult.bind(this))
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

