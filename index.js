var Runner = require('./lib/runner')
var runner = new Runner({ input: false, output: false })

exports = module.exports = runner.thunkify.bind(runner)
exports.run = exports.sequence = runner.sequence.bind(runner)
exports.parallel = runner.parallel.bind(runner)
exports.series = runner.series.bind(runner)
exports.Runner = Runner

