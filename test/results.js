import test from 'tape'
import { run } from '..'
import { Readable } from 'stream'

test('sync', function(t) {
  run(
    [
      function () {
        return 1
      },
    ],
    function (err, res) {
      t.same(res, [1])
    }
  )
  run(
    [
      function () {
        return [1, 2]
      },
    ],
    function (err, res) {
      t.same(
        res,
        [[1, 2]]
      )
    }
  )
  t.end()
})

test('stream', function(t) {
  t.plan(2)
  let streamRes = []
  run(
    [
      function () {
        let rs = Readable({ objectMode: true })
        let data = [1, 2]
        rs._read = function () {
          if (data.length) {
            this.push(data.pop())
          } else {
            this.push(null)
          }
        }
        process.nextTick(() => {
          rs.on('data', function (d) {
            streamRes.push(d)
          })
        })
        return rs
      },
    ],
    function (err, res) {
      t.equal(res[0], undefined)
      t.same(streamRes, [2, 1])
    }
  )
})

test('promise', function(t) {
  t.plan(2)
  run(
    [
      function () {
        return new Promise(function (rs) {
          process.nextTick(function () {
            rs(1)
          })
        })
      },
    ],
    function (err, res) {
      t.same(res, [1])
    }
  )
  run(
    [
      function () {
        return new Promise(function (rs) {
          process.nextTick(function () {
            rs([1, 2])
          })
        })
      },
    ],
    function (err, res) {
      t.same(res, [[1, 2]])
    }
  )
})

test('async', function(t) {
  t.plan(2)
  run(
    [
      function (next) {
        process.nextTick(function () {
          next(null, 1)
        })
      },
    ],
    function (err, res) {
      t.same(res, [1])
    }
  )
  run(
    [
      function (next) {
        process.nextTick(function () {
          next(null, [2, 3])
        })
      },
    ],
    function (err, res) {
      t.same(
        res,
        [[2, 3]]
      )
    }
  )
})

