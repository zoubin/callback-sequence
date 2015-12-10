var test = require('tap').test
var api = require('..')
var Runner = api.Runner
var delay = require('./lib/delay')

test('order', function(t) {
  t.plan(1)

  var res = []
  var runner = Runner()
  runner.series(
    delay(res, 10, 1),
    [
      delay(res, 0, 2),
      delay(res, 20, 3),
      delay(res, 10, 4),
    ],
    delay(res, 0, 5)
  )
  .then(function () {
    t.same(res, [1, 2, 4, 3, 5])
  })
})

test('results', function(t) {
  t.plan(2)

  var runner = Runner()
  runner.series(
    function (next) {
      next(null, 1, 2)
    },
    function () {
      return 3
    },
    function () {
      return Promise.resolve()
    }
  )
  .then(function (res) {
    t.same(res, [[1, 2], [3], []])
  })

  api.series(
    function (next) {
      next(null, 1, 2)
    },
    function () {
      return 3
    },
    function () {
      return Promise.resolve()
    }
  )
  .then(function (res) {
    t.same(res, [])
  })
})

test('args', function(t) {
  t.plan(1)
  var runner = Runner()

  runner.series(
    function (next) {
      next(null, 1)
    },
    [
      function () {
        return Promise.resolve(2)
      },
      [
        function (next) {
          next(null, 3)
        },
        function (a) {
          return Promise.resolve(a + 1)
        },
        function (a, next) {
          next(null, a + 1, a + 2)
        },
      ],
      function (next) {
        next(null, 4)
      },
    ],
    function () {
    }
  )
  .then(function (res) {
    t.same(res, [
      [1],
      [[2], [5, 6], [4]],
      [],
    ])
  })
})

