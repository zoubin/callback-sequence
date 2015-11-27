var test = require('tape')
var run = require('..').run
var Readable = require('stream').Readable

test('args', function(t) {

  return run([
    function (res) {
      t.same(res, [1])
      res.push(2)
      return res
    },
    function (res) {
      t.same(res, [1, 2])
      return new Promise(function (resolve) {
        process.nextTick(function () {
          res.push(3)
          resolve(res)
        })
      })
    },
    function (res, cb) {
      t.same(res, [1, 2, 3])
      setTimeout(function() {
        cb(null, res, 4)
      }, 0)
    },
  ], [[1]])
  .then(function (res) {
    t.same(res, [[1, 2, 3], 4])
  })
  .then(function () {
    return run([
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
  })
  .then(function (res) {
    t.same(res, [3, 4])
  })
  .then(function () {
    return run([ function () {} ])
  })
  .then(function (res) {
    t.same(res, [])
  })
  .then(function () {
    return run([ function (cb) { process.nextTick(cb) } ])
  })
  .then(function (res) {
    t.same(res, [])
  })
  .then(function () {
    return run([ function () {
      return new Promise(function (resolve) {
        process.nextTick(resolve)
      })
    } ])
  })
  .then(function (res) {
    t.same(res, [])
  })
  .then(function () {
    return run([ stream ], [[]])
  })
  .then(function (res) {
    t.same(res, [])
  })
  .then(function () {
    return run([
      function () { return 1 },
      function (res, cb) {
        t.equal(res, 1)
        process.nextTick(cb)
      },
    ])
  })
  .then(function (res) {
    t.same(res, [])
  })
  .then(function () {
    return run([
      function () { return 1 },
      [
        function (res, cb) {
          t.equal(res, 1)
          setTimeout(function() {
            cb(null, 2)
          }, 0)
        },
        function (res, cb) {
          t.equal(res, 1)
          process.nextTick(function () {
            cb(null, 3)
          })
        },
      ],
    ])
  })
  .then(function (res) {
    t.same(res, [[2], [3]])
  })

})

function stream(res) {
  var rs = Readable({ objectMode: true })
  var data = ['a', 'b']
  rs._read = function () {
    if (data.length) {
      this.push(data.pop())
    } else {
      this.push(null)
    }
  }
  process.nextTick(function () {
    rs.on('data', function (d) {
      if (d) {
        res.push(d.toString())
      }
    })
  })
  return rs
}

