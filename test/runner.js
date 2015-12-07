var test = require('tap').test
var thunkify = require('..')
var run = thunkify.run
var parallel = thunkify.parallel

test('sequence', function(t) {
  var res = []
  return run([
    delay(res, 0),
    delay(res, 20),
    delay(res, 10),
  ])
  .then(function () {
    t.same(res, [0, 20, 10])
  })
})

test('parallel', function(t) {
  var res = []
  return parallel([
    delay(res, 0),
    delay(res, 20),
    delay(res, 10),
  ])
  .then(function () {
    t.same(res, [0, 10, 20])
  })
})

test('thunkify', function(t) {
  var res = []
  var cb = thunkify(
    delay(res, 0),
    delay(res, 20),
    delay(res, 10)
  )
  return cb().then(function () {
    t.same(res, [0, 20, 10])
  })
})

test('sequence nested', function(t) {
  var res = []
  return run([
    delay(res, 10, 1),
    [
      delay(res, 0, 2),
      delay(res, 20, 3),
      delay(res, 10, 4),
    ],
    delay(res, 0, 5),
  ])
  .then(function () {
    t.same(res, [1, 2, 4, 3, 5])
  })
})

test('parallel nested', function(t) {
  var res = []
  return parallel([
    delay(res, 10, 1),
    [
      delay(res, 0, 2),
      delay(res, 20, 3),
      delay(res, 10, 4),
    ],
    delay(res, 15, 5),
  ])
  .then(function () {
    t.same(res, [2, 1, 5, 3, 4])
  })
})

test('deep nested', function(t) {
  var res = []
  return run([
    delay(res, 10, 1),
    [
      delay(res, 20, 2),
      [
        delay(res, 10, 3),
        delay(res, 20, 4),
        delay(res, 0, 5),
      ],
      delay(res, 0, 6),
    ],
    delay(res, 0, 7),
  ])
  .then(function () {
    t.same(res, [1, 6, 3, 2, 4, 5, 7])
  })
})

function delay(res, t, n) {
  n = n == null ? t : n
  return function (cb) {
    setTimeout(function() {
      res.push(n)
      cb()
    }, t)
  }
}

