import test from 'tape'
import { last, run } from '..'
import { Readable } from 'stream'

test('chain', function(t) {
  t.plan(2)
  let streamRes = []
  run(
    [
      (next) => {
        process.nextTick(() => {
          next(null, 1)
        })
      },
      () => {
        return new Promise((rs) => {
          process.nextTick(() => {
            rs([2, 3])
          })
        })
      },
      () => {
        return [4, 5]
      },
      [(data) => {
        let rs = Readable({ objectMode: true })
        data = data.slice()
        rs._read = function () {
          if (data.length) {
            this.push(data.pop())
          } else {
            this.push(null)
          }
        }
        process.nextTick(() => {
          rs.on('data', (d) => {
            streamRes.push(d)
          })
        })
        return rs
      }, last],
    ],
    (err, res) => {
      t.same(
        res,
        [
          1,
          [2, 3],
          [4, 5],
          undefined,
        ]
      )
      t.same(streamRes, [5, 4])
    }
  )
})

