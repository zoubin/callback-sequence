# callback-sequence
Make a new callback to run callbacks in sequence or parallel.

[![version](https://img.shields.io/npm/v/callback-sequence.svg)](https://www.npmjs.org/package/callback-sequence)
[![status](https://travis-ci.org/zoubin/callback-sequence.svg?branch=master)](https://travis-ci.org/zoubin/callback-sequence)
[![dependencies](https://david-dm.org/zoubin/callback-sequence.svg)](https://david-dm.org/zoubin/callback-sequence)
[![devDependencies](https://david-dm.org/zoubin/callback-sequence/dev-status.svg)](https://david-dm.org/zoubin/callback-sequence#info=devDependencies)

Callbacks can be made async like [gulp tasks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#fn).

## Example

```javascript
var sequence = require('callback-sequence')
var Readable = require('stream').Readable
var gulp = require('gulp')

gulp.task('sequence', sequence(
  sync, async, promise, stream
))

gulp.task('parallel', sequence(
  [sync, async, promise, stream]
))

gulp.task('parallel-nested', sequence(
  // `async` and `promise` will be run in parallel
  sync, [async, promise], stream
))

gulp.task('sequence-nested', sequence(
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

### cb = sequence(...tasks)
Return a callback to run the specified tasks in appearance order.

`cb` will return a promise.

```javascript
var sequence = require('callback-sequence')

sequence(
  function () { console.log(1) },
  [
    function (cb) {
      setTimeout(function() {
        console.log(3)
        cb()
      }, 0)
    },
    function () {
      return new Promise(function (resolve) {
        process.nextTick(function () {
          console.log(2)
          resolve()
        })
      })
    },
  ],
  function () { console.log(4) },
)().then(function () {
  console.log('DONE')
})

// 1
// 2
// 3
// 4
// DONE


```

### res = sequence.run(tasks, initialArgs)
Run the specified tasks in sequence.

* `tasks`: Type: `Array`. If a task is specified as an array of subtasks, those tasks will be run with `sequence.parallel`
* `initialArgs`: Type: `Array`. Arguments passed to the first task.
* `res`: Type: `Promise`. Resolves to an array of results created by the last task.

```javascript
var sequence = require('callback-sequence')

run([
  function (a, b) {
    t.same([a, b], [1, 2])
    return a + b
  },
  function (res, cb) {
    t.same(res, 3)
    setTimeout(function() {
      cb(null, res, 4)
    }, 0)
  },
], [1, 2])
.then(function (res) {
  // [3, 4]
})

```

Actually, you can add callbacks dynamically:

```javascript
var run = require('callback-sequence').run

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
  // [ [5, 4, 3, 2, 1] ]
  console.log(res)
})

tasks.push(task)

```

### res = sequence.parallel(tasks, initialArgs)
Run the specified tasks in parallel.

* `tasks`: Type: `Array`. If a task is specified as an array of subtasks, those tasks will be run with `sequence.run`.
* `initialArgs`: Type: `Array`. Arguments passed to all tasks.
* `res`: Type: `Promise`. Resolves to an array of results created by the call tasks.

```javascript
var parallel = require('callback-sequence').parallel

parallel([
  function () { console.log(1) },
  [
    function (cb) {
      setTimeout(function() {
        console.log(3)
        cb()
      }, 0)
    },
    function () {
      return new Promise(function (resolve) {
        process.nextTick(function () {
          console.log(2)
          resolve()
        })
      })
    },
  ],
  function () { console.log(4) },
]
)
.then(function () {
  console.log('DONE')
})

// 1
// 4
// 3
// 2
// DONE


```

## [Changelog](changelog.md)

