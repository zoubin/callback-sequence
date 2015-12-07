var test = require('tap').test
var Runner = require('..').Runner
var runner = Runner({ output: true })

var run = runner.sequence.bind(runner)
var parallel = runner.parallel.bind(runner)
var thunkify = runner.thunkify.bind(runner)

var Stream = require('./lib/stream')

test('sync', function(t) {
  return run([
    function () {
      return 1
    },
  ])
  .then(function (res) {
    t.same(res, [1])
  })
  .then(function () {
    return run([ function () {} ])
    .then(function (res) {
      t.same(res, [])
    })
  })
})

test('async', function(t) {
  return run([
    function (next) {
      next(null, 1, 2)
    },
  ])
  .then(function (res) {
    t.same(res, [1, 2])
  })
  .then(function () {
    return run([ function (next) { next(null) } ])
    .then(function (res) {
      t.same(res, [])
    })
  })
  .then(function () {
    return run([ function (next) { next(null, undefined) } ])
    .then(function (res) {
      t.same(res, [])
    })
  })
  .then(function () {
    return run([ function (next) { next(null, null) } ])
    .then(function (res) {
      t.same(res, [null])
    })
  })
  .then(function () {
    return run([
      function (next) {
        next(null, 1, undefined, null, undefined)
      },
    ])
    .then(function (res) {
      t.same(res, [1, undefined, null])
    })
  })
})

test('promise', function(t) {
  return run([
    function () {
      return Promise.resolve(1)
    },
  ])
  .then(function (res) {
    t.same(res, [1])
  })
  .then(function () {
    return run([
      function () {
        return Promise.resolve()
      },
    ])
    .then(function (res) {
      t.same(res, [])
    })
  })
})

test('stream', function(t) {
  var output = []
  return run([
    function () {
      var rs = Stream.Readable([1, 2, 3])
      var ws = Stream.Writable(output)
      return rs.pipe(ws)
    },
  ])
  .then(function (res) {
    t.same(res, [])
  })
})

test('parallel', function(t) {
  return parallel([
    function (next) {
      next(null, 1, 2)
    },
    function () {
      return 3
    },
    function () {
      return Promise.resolve()
    },
  ])
  .then(function (res) {
    t.same(res, [[1, 2], [3], []])
  })
})

test('thunkify', function(t) {
  return thunkify(
    function (next) {
      next(null, 1, 2)
    }
  )()
  .then(function (res) {
    t.same(res, [1, 2])
  })
  .then(function () {
    return thunkify([
      function (next) {
        next(null, 1, 2)
      },
      function (next) {
        next(null, 3)
      },
    ])()
    .then(function (res) {
      t.same(res, [[1, 2], [3]])
    })
  })
})

test('disabled', function(t) {
  var scheduler = Runner({ output: false })
  return scheduler.sequence([
    function (next) {
      next(null, 1, 2)
    },
  ])
  .then(function (res) {
    t.equal(typeof res, 'undefined')
  })
})

