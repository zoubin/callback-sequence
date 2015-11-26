var test = require('tape')
var sequence = require('..')
var last = sequence.last

test('recursive', function(t) {
  t.plan(1)
  function sum(a, b, next) {
    process.nextTick(function () {
      next(null, a + b)
    })
  }
  sequence(
    [sum, last, 1],
    [sum, last, 1],
    [sequence([sum, last, 1], [sum, last, 1]), last]
  )(1, function (err, res) {
    t.same(res, [2, 3, [4, 5]])
  })
})

