var Stream = require('stream')
var Readable = Stream.Readable
var Writable = Stream.Writable
var Transform = Stream.Transform
var Duplex = Stream.Duplex

exports.Readable = function (input) {
  var stream = Readable({ objectMode: true })
  var i = 0
  stream._read = function () {
    if (i < input.length) {
      this.push(input[i++])
    } else {
      this.push(null)
    }
  }
  return stream
}

exports.Writable = function (output) {
  var stream = Writable({ objectMode: true })
  var i = 0
  stream._write = function (data, _, next) {
    output.push(data)
    next()
  }
  return stream
}

exports.Transform = function (tr) {
  var stream = Transform({ objectMode: true })
  var i = 0
  stream._transform = function (data, _, next) {
    if (tr) {
      return next(null, tr(data))
    }
    next(null, data)
  }
  return stream
}

exports.Duplex = function (writable, readable) {
  var stream = Duplex({ objectMode: true })
  var i = 0
  stream._read = function () {
    if (i < readable.length) {
      this.push(readable[i++])
    } else {
      this.push(null)
    }
  }
  stream._write = function (data, _, next) {
    writable.push(data)
    next()
  }
  return stream
}

