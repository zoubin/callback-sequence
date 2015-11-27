var run = require('..').run

var count = 5
var tasks = []

function task(res, next) {
  process.nextTick(function () {
    res.push(count)
    if (--count > 0) {
      tasks.push(task)
    }
    next(null, res)
  })
}
run(tasks, [[]]).then(function (res) {
  console.log(res)
})

tasks.push(task)
