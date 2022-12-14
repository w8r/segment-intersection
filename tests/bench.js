import benchmark from 'benchmark';
import { findIntersection } from '../dist/index.mjs';
import exactIntersect from 'exact-segment-intersect';
import lineintersect from 'line-segment-intersect-2d';
import segseg from 'segseg';

import chalk from 'chalk';

const segments = Array(100)
  .fill(0)
  .map(() => {
    const seg0 = Array(4)
      .fill(0)
      .map(() => Math.random() * 1000 - 500);
    const seg1 = Array(4)
      .fill(0)
      .map(() => Math.random() * 1000 - 500);
    return [seg0, seg1];
  });

new benchmark.Suite()
  // .add('intersection', function () {
  //   const [seg0, seg1] = segments[Math.floor(Math.random() * segments.length)];
  //   findIntersection(...seg0, ...seg1);
  // })
  .add(chalk.white('segment-intersection'), () => {
    const [seg0, seg1] = segments[Math.floor(Math.random() * segments.length)];
    findIntersection(
      seg0[0],
      seg0[1],
      seg0[2],
      seg0[3],
      seg1[0],
      seg1[1],
      seg1[2],
      seg1[3]
    );
  })
  .add(chalk.greenBright('exact-segment-intersect'), () => {
    const [seg0, seg1] = segments[Math.floor(Math.random() * segments.length)];
    exactIntersect(
      [seg0[0], seg0[1]],
      [seg0[2], seg0[3]],
      [seg1[0], seg1[1]],
      [seg1[2], seg1[3]]
    );
  })
  .add(chalk.blueBright('segseg'), () => {
    const [seg0, seg1] = segments[Math.floor(Math.random() * segments.length)];
    segseg(
      [],
      [seg0[0], seg0[1]],
      [seg0[2], seg0[3]],
      [seg1[0], seg1[1]],
      [seg1[2], seg1[3]]
    );
  })
  .add(chalk.magentaBright('line-segment-intersect-2d'), () => {
    const [seg0, seg1] = segments[Math.floor(Math.random() * segments.length)];
    lineintersect(
      [],
      [seg0[0], seg0[1]],
      [seg0[2], seg0[3]],
      [seg1[0], seg1[1]],
      [seg1[2], seg1[3]]
    );
  })
  .on('cycle', function (event) {
    console.log(' - ', String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
