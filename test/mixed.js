var test = require('tape');
var sequence = require('..');
var Readable = require('stream').Readable;

test('mixed', function(t) {
  t.plan(5);
  var i = 0;
  sequence(
    function () {
      t.equal(i++, 0);
    },
    function (done) {
      process.nextTick(function () {
        t.equal(i++, 1);
        done();
      });
    },
    function () {
      return new Promise(function (resolve) {
        t.equal(i++, 2);
        resolve();
      });
    },
    function () {
      var s = Readable();
      process.nextTick(function () {
        t.equal(i++, 3);
        s.push(null);
      });
      return s;
    }
  )(function () {
    t.ok(true);
  });
});

