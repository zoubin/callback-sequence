var test = require('tape')
var sequence = require('..')
var run = sequence.run
var parallel = sequence.parallel
var Readable = require('stream').Readable

test('sequence', function(t) {
  t.plan(2)
  Promise.resolve([])
    .then(function (res) {
      return sequence(sync(res), callback(res), promise(res), stream(res))()
        .then(function () {
          return res
        })
        .catch(function (err) {
          console.log(err)
        })
    })
    .then(function (res) {
      t.same(res, [1, 2, 3, 'b', 'a'], 'in sequence')
      return []
    })
    .then(function (res) {
      return sequence([sync(res), callback(res), promise(res), stream(res)])()
        .then(function () {
          return res
        })
    })
    .then(function (res) {
      t.same(res, [1, 3, 'b', 'a', 2], 'in parallel')
    })
})

test('run', function(t) {
  return Promise.resolve([])
    .then(function (res) {
      return run([sync(res), callback(res), promise(res), stream(res)])
        .then(function () {
          return res
        })
    })
    .then(function (res) {
      t.same(res, [1, 2, 3, 'b', 'a'], 'in sequence')
    })
})

test('parallel', function(t) {
  return Promise.resolve([])
    .then(function (res) {
      return parallel([sync(res), callback(res), promise(res), stream(res)])
        .then(function () {
          return res
        })
    })
    .then(function (res) {
      t.same(res, [1, 3, 'b', 'a', 2], 'in parallel')
    })
})

test('nested', function(t) {
  return Promise.resolve([])
    .then(function (res) {
      return run([sync(res), [callback(res), promise(res)], stream(res)])
        .then(function () {
          return res
        })
    })
    .then(function (res) {
      t.same(res, [1, 3, 2, 'b', 'a'], 'sequence with nested parallel')
      return []
    })
    .then(function (res) {
      return parallel([sync(res), [callback(res), promise(res)], stream(res)])
        .then(function () {
          return res
        })
    })
    .then(function (res) {
      t.same(res, [1, 'b', 'a', 2, 3], 'parallel with nested sequence')
      return []
    })
    .then(function (res) {
      return run([stream(res), [[callback(res), promise(res)], sync(res)]])
        .then(function () {
          return res
        })
    })
    .then(function (res) {
      t.same(res, ['b', 'a', 1, 2, 3], 'deep nested')
    })
})

function sync(res) {
  return function () {
    res.push(1)
  }
}

function callback(res) {
  return function (cb) {
    setTimeout(function() {
      res.push(2)
      cb()
    }, 0)
  }
}

function promise(res) {
  return function () {
    return new Promise(function (resolve) {
      process.nextTick(function () {
        res.push(3)
        resolve()
      })
    })
  }
}

function stream(res) {
  return function () {
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
}

