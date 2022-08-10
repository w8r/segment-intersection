import benchmark from 'benchmark';

new benchmark.Suite()
  .add('RegExp#test', function () {
    /o/.test('Hello World!');
  })
  .add('String#indexOf', function () {
    'Hello World!'.indexOf('o') > -1;
  })
  .add('String#match', function () {
    !!'Hello World!'.match(/o/);
  })
  .on('cycle', function (event: benchmark.Event) {
    console.log(String(event.target));
  })
  .on('complete', function (this: benchmark.Suite) {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
