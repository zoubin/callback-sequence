var runTask = require('orchestrator/lib/runTask');
var noop = function () {};

module.exports = sequence;
module.exports.run = run;

function sequence() {
  var callbacks = [].concat.apply([], arguments);
  return function (done) {
    run(callbacks, done);
  };
}

function run(callbacks, done) {
  done = done || noop;
  if (callbacks.length === 0) {
    return done();
  }
  var cb = callbacks[0];
  if (typeof cb === 'function') {
    runTask(cb, next);
  } else {
    next(null);
  }
  function next(err) {
    if (err) {
      return done(err);
    }
    run(callbacks.slice(1), done);
  }
}
