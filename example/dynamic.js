var run = require('..').run

var count = 5
var tasks = []

var res = []
function task(next) {
  process.nextTick(function () {
    res.push(count)
    if (--count > 0) {
      tasks.push(task)
    }
    next()
  })
}
run(tasks).then(function () {
  // [5, 4, 3, 2, 1]
  console.log(res)
})

tasks.push(task)
