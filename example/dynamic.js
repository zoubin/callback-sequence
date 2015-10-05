var sequence = require('..');

var tasks = [task];
var count = 0;
function task(next) {
  process.nextTick(function () {
    count++;
    if (count < 5) {
      tasks.push(task);
    }
    next(null, count);
  });
}
sequence.run(tasks, function (err, res) {
  console.log(res);
  // [ 1, 2, 3, 4, 5 ]
});

