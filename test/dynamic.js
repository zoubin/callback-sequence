var test = require('tap').test;
var sequence = require('..');
var run = sequence.run;

test('dynamic', function(t) {
  t.plan(1);
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
  run(tasks, function (err, res) {
    t.same(res, [1, 2, 3, 4, 5]);
  });
});

