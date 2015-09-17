var sequence = require('..');

function sum(a, b, next) {
  process.nextTick(function () {
    next(null, a + b);
  });
}
sequence.run([
  [sum, sequence.last, 1],
  [sum, sequence.last, 1],
  [sum, sequence.last, 1],
], 1, function (err, res) {
  console.log('Expected:', [2, 3, 4]);
  console.log('Actual:', res);
});


