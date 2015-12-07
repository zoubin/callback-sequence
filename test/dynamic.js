var test = require('tap').test
var run = require('..').run

test('dynamic', function(t) {
  var count = 5
  t.plan(count + 1)
  var tasks = []

  function task(next) {
    process.nextTick(function () {
      t.ok(true)
      if (--count > 0) {
        tasks.push(task)
      }
      next()
    })
  }
  run(tasks).then(function () {
    t.ok(true)
  })

  tasks.push(task)
})

