const Benchmark = require('benchmark')

const { benchmarkable: subject } = require('./index')

new Benchmark.Suite()
  .add('subject', subject)
  .on('cycle', (event) => console.log(String(event.target)))
  .on('complete', function () {
    console.log('---\n' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
