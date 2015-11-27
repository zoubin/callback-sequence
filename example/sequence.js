var sequence = require('..')

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
  function () {
    var Readable = require('stream').Readable
    var rs = Readable({ objectMode: true })
    var data = [null, 'a', 'b']
    rs._read = function () {
      this.push(data.pop())
    }
    process.nextTick(function () {
      rs.on('data', function (d) {
        if (d) {
          console.log(d)
        }
      })
    })
    return rs
  }
)().then(function () {
  console.log('DONE')
})

