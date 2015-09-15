# callback-sequence
Make a new callback to run input callbacks in sequence

It is meant to make it easy to construct a [gulp](https://npmjs.org/package/gulp) task from a sequence of callbacks.

## Usage

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

## cb = sequence()

Each argument passed in could be a [gulp task callback](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname-deps-fn),
or an array containing such elements.

`sequence` will create a callback to run all those specified tasks in appearance order.
`cb` has signature `cb(done)`, and `done` is called after those tasks finish,
with an error object or `null`.

## sequence.run(callbacks, done)

### callbacks
Type: `Array`

An array of [gulp task callback](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname-deps-fn)s.

`done`, if specified, is called after all tasks finish,
with an error object or `null`.

