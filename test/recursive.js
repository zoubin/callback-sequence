var test = require('tape');
var sequence = require('..');
var Readable = require('stream').Readable;

test('recursive', function(t) {
  t.plan(5);
  var i = 0;
  var sync = function () {
    t.equal(i++, 0);
  };
  var async = function (done) {
    process.nextTick(function () {
      t.equal(i++, 1);
      done();
    });
  };
  var stream = function () {
    var s = Readable();
    process.nextTick(function () {
      t.equal(i++, 3);
      s.push(null);
    });
    return s;
  };
  var promise = function () {
    return new Promise(function (resolve) {
      t.equal(i++, 2);
      resolve();
    });
  };

  sequence(
    sync,
    sequence(
      async,
      sequence(
        promise,
        sequence(
          stream
        )
      )
    )
  )(function () {
    t.ok(true);
  });
});

