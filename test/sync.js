var test = require('tape');
var sequence = require('..');

test('sync', function(t) {
  t.plan(4);
  var i = 0;
  sequence(
    function () { t.equal(i++, 0); },
    function () { t.equal(i++, 1); },
    function () { t.equal(i, 2); }
  )(function () {
    t.ok(true);
  });
});

