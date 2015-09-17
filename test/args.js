var test = require('tap').test;
var sequence = require('..');
var run = sequence.run;

test('arguments', function(t) {
  t.plan(1);
  function sum(a, b, next) {
    process.nextTick(function () {
      next(null, a + b);
    });
  }
  run(
    [
      [sum, sequence.last, 1],
      [sum, sequence.last, 1],
      [sum, sequence.last, 1],
    ],
    1,
    function (err, res) {
      t.same(res, [2, 3, 4]);
    }
  );
});

