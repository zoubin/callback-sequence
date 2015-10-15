import test from 'tape'
import { run } from '..'

test('dynamic', function(t) {
  t.plan(1)
  let tasks = [task]
  let count = 0

  function task(next) {
    process.nextTick(() => {
      count++
      if (count < 5) {
        tasks.push(task)
      }
      next(null, count)
    })
  }
  run(tasks, (err, res) => {
    t.same(res, [1, 2, 3, 4, 5])
  })
})

