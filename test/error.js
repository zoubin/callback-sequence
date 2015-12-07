var test = require('tap').test
var run = require('..').run

test('error', function(t) {
  t.plan(2)
  var ex = new Error('error')
  run([
    function () {
      t.ok(true)
    },
    function (cb) {
      cb(ex)
    },
    function () {
      t.ok(false)
    },
  ]).catch(function (err) {
    t.same(err, ex)
  })
})

