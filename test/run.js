var test = require('tape')
var run = require('..').run

test('run', function(t) {
  t.plan(3)
  run([
    function () {
      t.ok(true)
    },
    function () {
      process.nextTick(function () {
        t.ok(true)
      })
    },
    function () {
      return new Promise(function (resolve) {
        process.nextTick(function () {
          t.ok(true)
          resolve()
        })
      })
    },
  ])
})

