import test from 'tape'
import { first, last, run } from '..'

test('last', function(t) {
  t.plan(1)
  function sum(a, b, next) {
    process.nextTick(function () {
      next(null, a + b)
    })
  }
  run(
    [
      [sum, last, 1],
      [sum, last, 1],
      [sum, last, 1],
    ],
    1,
    (err, res) => {
      t.same(res, [2, 3, 4])
    }
  )
})

test('first', function(t) {
  t.plan(1)
  function order(a, b, next) {
    process.nextTick(() => {
      next(null, a + b)
    })
  }
  run(
    [
      [order, first, 1],
      [order, first, 2],
      [order, first, 3],
    ],
    10,
    (err, res) => {
      t.same(res, [11, 12, 13])
    }
  )
})

