import { first, last, run } from './run'

export default function sequence() {
  return run.bind(null, arguments)
}

sequence.last = last
sequence.first = first
sequence.run = run

