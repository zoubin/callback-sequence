var test = require('tape');
var sequence = require('..');
var Stream = require('stream');
var Readable = Stream.Readable;

var syncNoop = function () {
};
var asyncNoop = function (cb) {
    process.nextTick(function () {
        cb();
    });
};
var promiseNoop = function () {
    return Promise.resolve();
};
var streamNoop = function () {
    var s = Readable();
    s.push(null);
    return s;
};

test('sync', function(t) {
    sequence(noop(syncNoop, t))();
});

test('async', function(t) {
    sequence(noop(asyncNoop, t, true))();
});

test('promise', function(t) {
    sequence(noop(promiseNoop, t))();
});

test('stream', function(t) {
    sequence(noop(streamNoop, t))();
});

test('mix', function(t) {
    t.plan(4);
    var i = 0;

    sequence([
        before(syncNoop, assert.bind(null, 0)),
        before(asyncNoop, assert.bind(null, 1), true),
        before(promiseNoop, assert.bind(null, 2)),
        before(streamNoop, assert.bind(null, 3))
    ])();

    function assert(j) {
        t.equal(i++, j);
    }
});

function noop(cb, t, has) {
    t.plan(3);
    var i = 0;
    return [
        before(cb, assert.bind(null, 0), has),
        before(cb, assert.bind(null, 1), has),
        before(cb, assert.bind(null, 2), has)
    ];

    function assert(j) {
        t.equal(i++, j);
    }
}

function before(cb, b, has) {
    return function () {
        b();
        if (has) {
            return cb(syncNoop);
        }
        return cb();
    };
}
