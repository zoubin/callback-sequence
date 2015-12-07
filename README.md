# callback-sequence
[![version](https://img.shields.io/npm/v/callback-sequence.svg)](https://www.npmjs.org/package/callback-sequence)
[![status](https://travis-ci.org/zoubin/callback-sequence.svg?branch=master)](https://travis-ci.org/zoubin/callback-sequence)
[![dependencies](https://david-dm.org/zoubin/callback-sequence.svg)](https://david-dm.org/zoubin/callback-sequence)
[![devDependencies](https://david-dm.org/zoubin/callback-sequence/dev-status.svg)](https://david-dm.org/zoubin/callback-sequence#info=devDependencies)

Make a new callback to run callbacks in sequence or parallel.

Callbacks can be made async like [gulp tasks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#fn).

## Example

```javascript
var thunkify = require('callback-sequence')

var Readable = require('stream').Readable
var gulp = require('gulp')

gulp.task('sequence', thunkify(
  sync, async, promise, stream
))

gulp.task('parallel', thunkify(
  [sync, async, promise, stream]
))

gulp.task('parallel-nested', thunkify(
  // `async` and `promise` will be run in parallel
  sync, [async, promise], stream
))

gulp.task('sequence-nested', thunkify(
  // `async` and `promise` will be run in sequence
  [sync, [async, promise], stream]
))

function sync() {
}

function async(cb) {
  process.nextTick(cb)
}

function promise() {
  return Promise.resolve()
}

function stream() {
  var s = Readable()
  s.push(null)
  return s
}

```

## API

### cb = thunkify(...tasks)
Return a callback to run the specified tasks in the appearance order.

`cb` will return a promise.

```javascript
var res = []
thunkify(
  function () {
    res.push(1)
  },
  function (next) {
    process.nextTick(function () {
      res.push(2)
      next()
    })
  },
  function () {
    return Promise.resolve().then(function () {
      res.push(3)
    })
  }
)()
.then(function () {
  // [1, 2, 3]
  console.log(res)
})

```

### thunkify.run(tasks)
It just runs `tasks` like you call the function returned by `thunkify`

**NOTE**: if some task is an array of sub-tasks, they will be run in parallel.

```javascript
var run = require('callback-sequence').run

var res = []
run([
  function () { res.push(1) },
  [
    function (cb) {
      setTimeout(function() {
        res.push(3)
        cb()
      }, 0)
    },
    function () {
      return new Promise(function (resolve) {
        process.nextTick(function () {
          res.push(2)
          resolve()
        })
      })
    },
  ],
  function () { res.push(4) },
]
)
.then(function () {
  // [1, 2, 3, 4]
  console.log(res)
})

```

Callbacks an be added dynamically:

```javascript
var run = require('callback-sequence').run

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

```

### thunkify.parallel(tasks)
Run the specified tasks in parallel.

**NOTE**: if some task is an array of sub-tasks, they will be run in sequence.

```javascript
var parallel = require('callback-sequence').parallel

var res = []
parallel([
  function () { res.push(1) },
  [
    function () {
      return Promise.resolve().then(function () {
        res.push(4)
      })
    },
    function () { res.push(5) },
  ],
  function (cb) {
    setTimeout(function() {
      res.push(3)
      cb()
    }, 0)
  },
  function (cb) {
    res.push(2)
    cb()
  },
]
)
.then(function () {
  // [1, 2, 4, 5, 3]
  console.log(res)
})

```

### Runner = thunkify.Runner(opts)
Return a new runner instance, with the following methods:

* `sequence`: just like `thunkify.run`
* `parallel`: just like `thunkify.parallel`
* `thunkify`: just like `thunkify`

#### opts

##### input
Specify whether to pass the results of the previous callback to the next as arguments.

Type: `Boolean`

Default: `true`

```javascript
var Runner = require('callback-sequence').Runner

var runner = Runner({ input: true })

runner.thunkify(
  function (a, b) {
    // 3
    return a + b
  },
  function (sum, next) {
    process.nextTick(function () {
      // 6
      next(null, sum * 2)
    })
  },
  function (product) {
    return Promise.resolve().then(function () {
      // 7
      return product + 1
    })
  }
)(1, 2)
.then(function (res) {
  // [7]
  console.log(res)
})


```

##### output
Specify whether to pass the results of the last callback to the final results.

Type: `Boolean`

Default: `true`

## [Changelog](changelog.md)

