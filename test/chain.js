var test = require('tap').test;
var sequence = require('..');
var run = sequence.run;
var Stream = require('stream');

test('chain', function(t) {
  t.plan(2);
  var streamRes = [];
  run(
    [
      function (next) {
        process.nextTick(function () {
          next(null, 1);
        });
      },
      function () {
        return new Promise(function (rs) {
          process.nextTick(function () {
            rs([2, 3]);
          });
        });
      },
      function () {
        return [4, 5];
      },
      [function (data) {
        var rs = Stream.Readable({ objectMode: true });
        data = data.slice();
        rs._read = function () {
          if (data.length) {
            this.push(data.pop());
          } else {
            this.push(null);
          }
        };
        process.nextTick(function () {
          rs.on('data', function (d) {
            streamRes.push(d);
          });
        });
        return rs;
      }, sequence.last],
    ],
    function (err, res) {
      t.same(
        res,
        [
          1,
          [2, 3],
          [4, 5],
          undefined,
        ]
      );
      t.same(streamRes, [5, 4]);
    }
  );
});

