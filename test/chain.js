var test = require('tap').test
var Runner = require('..').Runner
var runner = Runner({ input: true, output: true })

var run = runner.sequence.bind(runner)
var parallel = runner.parallel.bind(runner)
var thunkify = runner.thunkify.bind(runner)

var Stream = require('./lib/stream')

test('sync', function(t) {
  return Promise.resolve()
  .then(function () {
    return run([
      function () {
      },
      function (next) {
        t.equal(arguments.length, 1)
        next()
      },
    ])
  })
  .then(function () {
    return run([
      function () {
        return 1
      },
      function (a, next) {
        t.equal(a, 1)
        next()
      },
    ])
  })
  .then(function () {
    return run([
      function () {
        return [1]
      },
      function (a, next) {
        t.same(a, [1])
        next()
      },
    ])
  })
})

test('async', function(t) {
  return Promise.resolve()
  .then(function () {
    return run([
      function (next) {
        next()
      },
      function (next) {
        t.equal(arguments.length, 1)
        next()
      },
    ])
  })
  .then(function () {
    return run([
      function (next) {
        next(null, 1, 2)
      },
      function (a, b) {
        t.same([a, b], [1, 2])
      },
    ])
  })
})

test('promise', function(t) {
  return Promise.resolve()
  .then(function () {
    return run([
      function () {
        return Promise.resolve()
      },
      function (next) {
        t.equal(arguments.length, 1)
        next()
      },
    ])
  })
  .then(function () {
    return run([
      function () {
        return Promise.resolve(1)
      },
      function (a) {
        t.equal(a, 1)
      },
    ])
  })
})

test('stream', function(t) {
  return Promise.resolve()
  .then(function () {
    var output = []
    return run([
      function () {
        var rs = Stream.Readable([1, 2, 3])
        var ws = Stream.Writable(output)
        return rs.pipe(ws)
      },
      function (next) {
        t.equal(arguments.length, 1)
        t.same(output, [1, 2, 3])
        next()
      },
    ])
  })
})

test('sequenced parallel', function(t) {
  return run([[
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next(null, 3)
    },
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next(null, 4)
    },
  ]], [1, 2])
  .then(function (res) {
    t.same(res, [[3], [4]])
  })
})

test('parallelled sequence', function(t) {
  return parallel([[
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next(null, 3, 4)
    },
    function (a, b, next) {
      t.same([a, b], [3, 4])
      next(null, 5, 6)
    },
  ]], [1, 2])
  .then(function (res) {
    t.same(res, [[5, 6]])
  })
})

test('thunkify sequence', function(t) {
  return thunkify(
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next(null, 3, 4)
    },
    function (a, b) {
      t.same([a, b], [3, 4])
      return 5
    }
  )(1, 2)
  .then(function (res) {
    t.same(res, [5])
  })
})

test('thunkify parallel', function(t) {
  return thunkify([
    function (a, b, next) {
      t.same([a, b], [1, 2])
      next(null, 3, 4)
    },
    function (a, b) {
      t.same([a, b], [1, 2])
      return 5
    },
  ])(1, 2)
  .then(function (res) {
    t.same(res, [[3, 4], [5]])
  })
})

test('recursive', function(t) {
  return run([
    function (next) {
      next(null, 1, 2)
    },
    thunkify(
      function (a, b, next) {
        t.same([a, b], [1, 2])
        next(null, 3, 4)
      }
    ),
    function (arg, next) {
      t.same(arg, [3, 4])
      next()
    },
  ])
})

test('nested', function(t) {
  return run([
    function (next) {
      next(null, 1, 2)
    },
    [
      function (a, b, next) {
        t.same([a, b], [1, 2])
        process.nextTick(function () {
          next(null, 3, 4)
        })
      },
      function (a, b) {
        t.same([a, b], [1, 2])
        return 5
      },
    ],
    function (x, y, next) {
      t.same(x, [3, 4])
      t.same(y, [5])
      next(null, 6)
    },
  ])
  .then(function (res) {
    t.same(res, [6])
  })
})

