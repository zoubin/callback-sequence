var bindAsync = require('run-callback').bindAsync;

var noop = function () {};
var undef;

module.exports = sequence;
module.exports.run = run;
module.exports.last = {};

function sequence() {
  return run.bind(null, arguments);
}

function run(things, initial, done) {
  var res = [];
  if (arguments.length < 3) {
    if (typeof initial === 'function') {
      done = initial;
      initial = undef;
    }
  }
  done = done || noop;

  (function NEXT(i) {
    if (i >= things.length) {
      return done(null, res);
    }
    bind(things[i], res, initial)(function (err, r) {
      if (err) {
        return done(err, res);
      }
      res.push(r);
      NEXT(++i);
    });
  }(0));
}

function bind(fn, res, initial) {
  var args = [].concat(fn).map(function (j) {
    if (j === sequence.last) {
      return res.length === 0 ? initial : res[res.length - 1];
    }
    return j;
  });
  return bindAsync.apply(null, args);
}

