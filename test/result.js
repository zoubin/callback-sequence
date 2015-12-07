var test = require('tap').test
var runner = require('../lib/runner')()
var run = runner.sequence.bind(runner)
var parallel = runner.parallel.bind(runner)
var thunkify = runner.thunkify.bind(runner)

test('sequence', function(t) {
  return Promise.resolve()
  .then(function () {
    return run([
      function () {
        return 1
      },
    ])
    .then(function (res) {
      t.same(res, [1], 'sync')
    })
  })
  .then(function () {
    return run([
      function (next) {
        next(null, 1, 2)
      },
    ])
    .then(function (res) {
      t.same(res, [1, 2], 'callback')
    })
  })
  .then(function () {
    return run([
      function () {
        return Promise.resolve(1)
      },
    ])
    .then(function (res) {
      t.same(res, [1], 'promise')
    })
  })
  .then(function () {
    return run([
      function () {
        return Promise.resolve(1)
      },
      function (arg, next) {
        next(null, 2, 3)
      },
    ])
    .then(function (res) {
      t.same(res, [2, 3], 'chain')
    })
  })
  .then(function () {
    return run([
      function () {
        return Promise.resolve(1)
      },
      function () {
      },
    ])
    .then(function (res) {
      t.same(res, [])
    })
  })
})

test('parallel', function(t) {
  return Promise.resolve()
  .then(function () {
    parallel([
      function () {
        return 1
      },
      function (next) {
        setTimeout(function() {
          next(null, 2)
        }, 0)
      },
      function () {
        return Promise.resolve(3)
      },
    ])
    .then(function (res) {
      t.same(res, [1, 2, 3])
    })
  })
})

test('thunkify', function(t) {
  return thunkify(
    function (arg1, arg2) {
      return arg1 + arg2
    }
  )(1, 2)
  .then(function (res) {
    t.same(res, [3])
  })
})

