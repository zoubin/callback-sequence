var test = require('tap').test
var Runner = require('..').Runner

test('custom run function', function(t) {
  var ctx = {}
  var runner = Runner({
    run: function (cb) {
      return [cb.apply(ctx, Array.prototype.slice.call(arguments, 1))]
    },
  })

  return runner.sequence([
    function () {
      t.equal(this, ctx)
      return 1
    },
    function (a) {
      t.equal(a, 1)
      t.equal(this, ctx)
      return 2
    },
  ]).then(function (res) {
    t.same(res, [2])
  })
})

test('custom runner option', function(t) {
  var runner = Runner({
    run: { async: false },
  })

  return runner.sequence([
    function () {
      t.equal(arguments.length, 0)
      return 1
    },
    function (a) {
      t.equal(a, 1)
      t.equal(arguments.length, 1)
      return Promise.resolve(2)
    },
  ]).then(function (res) {
    t.same(res, [2])
  })
})

