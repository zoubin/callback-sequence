var test = require('tape');
var sequence = require('..');
var Readable = require('stream').Readable;

test('stream', function(t) {
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
      var s = Readable();
      process.nextTick(function () {
        t.equal(i++, j);
        s.push(null);
      });
      return s;
    };
  }
});

