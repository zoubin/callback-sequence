var test = require('tap').test
var Runner = require('..').Runner
var runner = Runner({ input: true })

var run = runner.sequence.bind(runner)
var parallel = runner.parallel.bind(runner)
var thunkify = runner.thunkify.bind(runner)

test('undefined', function(t) {
  return run([
    function (next) {
      t.equal(arguments.length, 1)
      next()
    },
  ])
})

test('null', function(t) {
  return run([
    function (arg, next) {
      t.equal(arg, null)
      next()
    },
  ], null)
})

test('object', function(t) {
  var initial = {}
  return run([
    function (arg, next) {
      t.equal(arg, initial)
      next()
    },
  ], initial)
})

test('empty array', function(t) {
  return run([
    function (next) {
      t.equal(arguments.length, 1)
      next()
    },
  ], [])
})

test('array', function(t) {
  return run([
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next()
    },
  ], [1, 2])
})

test('parallel', function(t) {
  return parallel([
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next()
    },
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next()
    },
  ], [1, 2])
})

test('thunkify', function(t) {
  return thunkify(
    function (a, b, next) {
      t.same([a, b], [1, 2], 'thunkify')
      next()
    }
  )(1, 2)
})

test('disabled', function(t) {
  var scheduler = Runner({ input: false })
  return scheduler.sequence([
    function (next) {
      t.equal(arguments.length, 1)
      next(null, 1, 2)
    },
  ], [1, 2])
})

test('single function', function(tt) {
  tt.test('sequence', function(t) {
    return run(function (next) {
      t.equal(arguments.length, 1)
      next()
    })
  })
  tt.test('parallel', function(t) {
    return parallel(function (next) {
      t.equal(arguments.length, 1)
      next()
    })
  })
  tt.end()
})

