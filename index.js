var util = require('util');
var runTask = require('orchestrator/lib/runTask');

module.exports = function (callbacks) {
    if (!callbacks) {
        callbacks = [];
    }
    if (!Array.isArray(callbacks)) {
        callbacks = Array.prototype.slice.call(arguments);
    }
    callbacks = callbacks.filter(util.isFunction);

    var maxLen = callbacks.length;

    return function (done) {
        done = done || function () {};

        (function next(i) {
            if (i >= maxLen) {
                return done();
            }
            var cb = callbacks[i];
            runTask(cb, function (err) {
                if (err) {
                    return done(err);
                }
                next(++i);
            });
        }(0));
    };
};
