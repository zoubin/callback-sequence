import { bindAsync } from 'run-callback'

export var last = {}
export var first = {}

export function run(things, initial, done) {
  if (arguments.length < 3) {
    if (typeof initial === 'function') {
      done = initial
      initial = null
    }
  }

  next(things, initial, done || function () {}, [], 0)
}

function next(things, initial, done, res, i) {
  if (i >= things.length) {
    return done(null, res)
  }
  bind(things[i], res, initial)((err, r) => {
    if (err) {
      return done(err, res)
    }
    res.push(r)
    next(things, initial, done, res, ++i)
  })
}

function bind(fn, res, initial) {
  return bindAsync.apply(null, [].concat(fn).map((j) => {
    if (j === last) {
      return res.length === 0 ? initial : res[res.length - 1]
    }
    if (j === first) {
      return initial == null ? res[0] : initial
    }
    return j
  }))
}

