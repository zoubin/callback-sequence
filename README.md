# callback-sequence
Make a new callback to run callbacks in sequence.

Callbacks can be made async like [gulp tasks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#fn).

# Usage

```javascript
var sequence = require('callback-sequence');
var Readable = require('stream').Readable;
var gulp = require('gulp');

gulp.task('publish', sequence(
  read, lint, warn, bump
));

function lint() {
}

function warn(cb) {
  process.nextTick(cb);
}

function bump() {
  return Promise.resolve();
}

function read() {
  var s = Readable();
  s.push(null);
  return s;
}

```

# API

## cb = sequence(task1, task2,...)

`sequence` will create a callback to run all those specified tasks in appearance order.

### cb([initial,] done)

#### initial

Type: `mixed`

*Optional*

If specified, it can be passed to the first task through `sequence.last`.
See [task](#task).

#### done

Type: `Function`
Signature: `done(err, results)`

`done` is called after all tasks finish.

`results` is an array containing all results of the tasks.

### task

Type: `Function`, `Array`

If `Array`, the first element is treated as the callback,
and elements following the callback are passed to it as arguments.

```javascript
var sequence = require('callback-sequence');

function sum(a, b, next) {
  process.nextTick(function () {
    next(null, a + b);
  });
}
sequence(
  [sum, sequence.last, 1],
  [sum, sequence.last, 1],
  [sum, sequence.last, 1]
)(1, function (err, res) {
  console.log('Expected:', [2, 3, 4]);
  console.log('Actual:', res);
});
```

## sequence.run(callbacks, [initial, ] done)

### callbacks

Type: `Array`

Elements are [tasks](#task).


```javascript
var sequence = require('callback-sequence');

function sum(a, b, next) {
  process.nextTick(function () {
    next(null, a + b);
  });
}
sequence.run([
  [sum, sequence.last, 1],
  [sum, sequence.last, 1],
  [sum, sequence.last, 1],
], 1, function (err, res) {
  console.log('Expected:', [2, 3, 4]);
  console.log('Actual:', res);
});
```

## results

Type: `Array`

Store all the results of the tasks.

It is passed to [done](#done) as the second argument.

Sync callbacks deliver results with `return`,

async callbacks with the last argument passed to it (`next(err, res)`),

promisified callbacks with `resolve(res)`,

and streamified callbacks always deliver `undefined`.

