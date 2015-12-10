# callback-sequence
[![version](https://img.shields.io/npm/v/callback-sequence.svg)](https://www.npmjs.org/package/callback-sequence)
[![status](https://travis-ci.org/zoubin/callback-sequence.svg?branch=master)](https://travis-ci.org/zoubin/callback-sequence)
[![coverage](https://img.shields.io/coveralls/zoubin/callback-sequence.svg)](https://coveralls.io/github/zoubin/callback-sequence)
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

```javascript
var Runner = require('./lib/runner')
var runner = new Runner({ input: false, output: false })

exports = module.exports = runner.thunkify.bind(runner)
exports.run = exports.sequence = runner.sequence.bind(runner)
exports.parallel = runner.parallel.bind(runner)
exports.series = runner.series.bind(runner)
exports.Runner = Runner

```

### Runner
`var runner = Runner(opts)`
Create a new runner instance.

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
Specify whether to deliver results.

Type: `Boolean`

Default: `true`

If `false`, the final results will always be `[]`.

##### run
Specify a runner function to run each callback.

Type: `Function`, `Object`

Default: `null`

If `Function`, it receives a callback followed by a list of arguments,
and should return a promise to fetch the results (`Array`).

If `Object`, it is passed to
[`Runner of run-callback`](https://github.com/zoubin/run-callback#runner--runrunner)
to create a runner function.


#### cb = Runner.prototype.thunkify(...tasks)
Return a callback to run the specified tasks in the appearance order.

```javascript
var runner = Runner()

runner.thunkify(
  function (res) {
    return res + 1
  },
  function (res) {
    return Promise.resolve()
      .then(function () {
        return res + 1
      })
  },
  function (res, next) {
    process.nextTick(function () {
      next(null, res - 1, res + 1)
    })
  }
)(1)
.then(function (res) {
  // [ 2, 4 ]
  console.log(res)
})

```

#### Runner.prototype.sequence(tasks)
Run `tasks` in sequence.

**NOTE**: directly nested array of tasks will be run with `Runner.prototype.parallel`.

```javascript
var runner = Runner()

runner.sequence([
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
]).then(function () {
  console.log('DONE')
})

// 1
// 2
// 3
// 4
// DONE

```

Callbacks can be added dynamically:

```javascript
var runner = Runner()

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
runner.sequence(tasks).then(function () {
  // [5, 4, 3, 2, 1]
  console.log(res)
})

tasks.push(task)

```

#### Runner.prototype.parallel(tasks)
Run the specified tasks in parallel.

**NOTE**: directly nested array of tasks will be run with `Runner.prototype.sequence`.

```javascript
var runner = Runner()

var res = []
runner.parallel([
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
])
.then(function () {
  // [1, 2, 4, 5, 3]
  console.log(res)
})

```

#### Runner.prototype.series(...tasks)
Run `tasks` in sequence.

However, while the results of `sequence` is that of the last task,
the results of `series` is an array containing all results of the tasks.

In addition, the results of the previous task will not be passed to the next as arguments.

**NOTE**: each element will be passed to `Runner.prototype.sequence`.

```javascript
var runner = Runner()

runner.series(
  function () {
    console.log(1)
    return 1
  },
  [
    function () {
      return Promise.resolve().then(function () {
        console.log(4)
        return 4
      })
    },
    function (cb) {
      setTimeout(function() {
        console.log(3)
        cb(null, 3)
      }, 0)
    },
    function () {
      console.log(5)
      return 5
    },
  ],
  function (cb) {
    console.log(2)
    cb(null, 2)
  }
)
.then(function (res) {
  // 1
  // 5
  // 4
  // 3
  // 2
  // [ [ 1  ], [ [ 4  ], [ 3  ], [ 5  ]  ], [ 2  ]  ]
  console.log(res)
})

```


## [Changelog](changelog.md)

