var test = require('tap').test;
var sequence = require('..');

test('recursive', function(t) {
  t.plan(1);
  function sum(a, b, next) {
    process.nextTick(function () {
      next(null, a + b);
    });
  }
  sequence(
    [sum, sequence.last, 1],
    [sum, sequence.last, 1],
    [sequence(
      [sum, sequence.last, 1],
      [sum, sequence.last, 1]
    ), sequence.last]
  )(1, function (err, res) {
    t.same(res, [2, 3, [4, 5]]);
  });
});

