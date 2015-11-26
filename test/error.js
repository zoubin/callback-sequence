var test = require('tape')
var run = require('..').run

test('error', function(t) {
  t.plan(2)
  var ex = new Error('error')
  run(
    [
      function () {
        t.ok(true)
      },
      function (cb) {
        cb(ex)
      },
      function () {
        t.ok(true)
      },
    ],
    function (err) {
      t.equal(err, ex)
    }
  )
})

