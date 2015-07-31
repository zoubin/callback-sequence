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

## cb = sequence(callbacks)

### callbacks

Type: `Array`

Each element in `callbacks` is a [gulp task callback](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname-deps-fn).

### cb

Type: `Function`

Receives a `done` callback, which can be used as a gulp task callback.

`cb` will run `callbacks` in sequence.

