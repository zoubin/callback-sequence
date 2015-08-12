var test = require('tape');
var sequence = require('..');

test('promise', function(t) {
  t.plan(4);
  var i = 0;
  sequence(
    next(0),
    next(1),
    next(2)
  )(function () {
    t.ok(true);
  });

  function next(j) {
    return function () {
      return new Promise(function (resolve) {
        t.equal(i++, j);
        resolve();
      });
    };
  }
});

