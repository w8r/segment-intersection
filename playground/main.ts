import './style.css';
import { range } from 'd3-array';
import { select as d3Select } from 'd3-selection';
import { drag as d3Drag } from 'd3-drag';
import { findIntersection, result as intersection } from '../src';

declare global {
  interface Window {
    findIntersection?: typeof findIntersection;
    intersection?: typeof intersection;
  }
}

window.findIntersection = findIntersection;
window.intersection = intersection;

type Point = { x: number; y: number; index: number };

const width = window.innerWidth;
const height = window.innerHeight;
const resolution = 20;
const r = 15;

const points = [
  { x: 280, y: 260, index: 0 },
  { x: 580, y: 120, index: 1 },
  { x: 380, y: 130, index: 2 },
  { x: 580, y: 240, index: 3 },
];

const drag = d3Drag<SVGCircleElement, Point>().on('drag', dragged);
const svg = d3Select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

svg
  .append('g')
  .attr('class', 'vertical')
  .selectAll('.vertical')
  .data(range(1, width / resolution))
  .enter()
  .append('line')
  .attr('x1', (d) => d * resolution)
  .attr('y1', 0)
  .attr('x2', (d) => d * resolution)
  .attr('y2', height);

svg
  .append('g')
  .attr('class', 'horizontal')
  .selectAll('.horizontal')
  .data(range(1, height / resolution))
  .enter()
  .append('line')
  .attr('x1', 0)
  .attr('y1', (d) => d * resolution)
  .attr('x2', width)
  .attr('y2', (d) => d * resolution);

const segments = svg
  .append('g')
  .selectAll('line')
  .data([points[0], points[2]])
  .enter()
  .append('line')
  .attr('class', 'segment')
  .attr('x1', (d) => d.x)
  .attr('y1', (d) => d.y)
  .attr('x2', (d) => points[d.index + 1].x)
  .attr('y2', (d) => points[d.index + 1].y);

svg
  .selectAll('circle')
  .data(points)
  .enter()
  .append('circle')
  .attr('cx', (d) => d.x)
  .attr('cy', (d) => d.y)
  .attr('r', r)
  .call(drag);

const intersectionPoints = svg
  .append('g')
  .selectAll('circle')
  .data(intersection)
  .enter()
  .append('circle')
  .attr('class', 'intersection')
  .classed('hidden', true)
  .attr('cx', (d) => d[0])
  .attr('cy', (d) => d[1])
  .attr('r', 5);

function dragged(
  this: SVGCircleElement,
  { x, y }: { x: number; y: number },
  d: { x: number; y: number; index: number }
) {
  const gridX = round(Math.max(r, Math.min(width - r, x)), resolution);
  const gridY = round(Math.max(r, Math.min(height - r, y)), resolution);

  points[d.index].x = d.x = gridX;
  points[d.index].y = d.y = gridY;

  const segment = segments.filter((_, i) => (d.index < 2 ? i === 0 : i === 1));
  segment
    .attr('x1', (d) => d.x)
    .attr('y1', (d) => d.y)
    .attr('x2', (d) => points[d.index + 1].x)
    .attr('y2', (d) => points[d.index + 1].y);

  d3Select(this).attr('cx', d.x).attr('cy', d.y);

  highlightIntersections();
}

function round(p: number, n: number) {
  return p % n < n / 2 ? p - (p % n) : p + n - (p % n);
}

function highlightIntersections() {
  const isect = findIntersection(
    points[0].x,
    points[0].y,
    points[1].x,
    points[1].y,
    points[2].x,
    points[2].y,
    points[3].x,
    points[3].y
  );

  intersectionPoints
    .data(intersection)
    .attr('cx', (d) => d[0])
    .attr('cy', (d) => d[1]);

  if (isect === 0) {
    // no intersection
    intersectionPoints.classed('hidden', true);
  } else if (isect === 1) {
    // 1 intersection point
    intersectionPoints.classed('hidden', true);
    intersectionPoints.filter((_, i) => i === 0).classed('hidden', false);
  } else if (isect === 2) {
    // 2 intersection points
    intersectionPoints.classed('hidden', false);
  }
  document.getElementById('output')!.innerHTML =
    isect === 0
      ? ''
      : isect === 1
      ? `${formatPoint(intersection[0])}`
      : `${formatPoint(intersection[0])},\n${formatPoint(intersection[1])}`;
  console.log('Intersection: ', isect);
}

function formatPoint([x, y]: [number, number]) {
  return `${x.toFixed(2)}, ${y.toFixed(2)}`;
}

highlightIntersections();
