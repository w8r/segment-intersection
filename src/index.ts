//const EPS = 1e-9;

type Point = [number, number];

export const result: [Point, Point] = [
  [0, 0],
  [0, 0],
];

export function findIntersection(
  p0x: number,
  p0y: number,
  d0x: number,
  d0y: number,
  p1x: number,
  p1y: number,
  d1x: number,
  d1y: number,

  // p0: Point,
  // d0: Point,
  // p1: Point,
  // d1: Point,
  sqrEpsilon = 1e-6
): number {
  // segments P0 + s * D0 for s in [0, 1], P1 + t * D1 for t in [0,1]
  // const [p0x, p0y] = p0;
  // const [d0x, d0y] = d0;
  // const [p1x, p1y] = p1;
  // const [d1x, d1y] = d1;

  // adaptation from parametric form to the points
  const vax = d0x - p0x;
  const vay = d0y - p0y;
  const vbx = d1x - p1x;
  const vby = d1y - p1y;

  const ex = p1x - p0x;
  const ey = p1y - p0y;

  let kross = vax * vby - vay * vbx;
  let sqrKross = kross * kross;

  const sqrLen0 = vax * vax + vay * vay;
  const sqrLen1 = vbx * vbx + vby * vby;

  if (sqrKross > sqrEpsilon * sqrLen0 * sqrLen1) {
    // lines of the segments are not parallel
    const s = (ex * vby - ey * vbx) / kross;

    // intersection of lines is not a point on segment P0 + s * D0
    if (s < 0 || s > 1) return 0;
    const t = (ex * d0y - ey * d0x) / kross;
    // intersection of lines is not a point on segment P1 + t * D1
    if (t < 0 || t > 1) return 0;

    // intersection of lines is a point on each segment
    if (s === 0 || s === 1) {
      // on an endpoint of line segment a
      result[0][0] = p0x + s * vax;
      result[0][1] = p0y + s * vay;
    } else if (t === 0 || t === 1) {
      // on an endpoint of line segment b
      result[0][0] = p1x + t * vbx;
      result[0][1] = p1y + t * vby;
    } else {
      result[0][0] = p0x + s * vax;
      result[0][1] = p0y + s * vay;
    }
    return 1;
  }

  // lines of the segments are parallel
  const sqrLenE = ex * ex + ey * ey;

  kross = ex * vay - ey * vax;
  //kross = ex * d0y - ey * d0x;
  sqrKross = kross * kross;

  // lines of the segments are different
  if (sqrKross > sqrEpsilon * sqrLen0 * sqrLenE) return 0;

  // Lines of the segments are the same.  Need to test for overlap of
  // segments.

  //    s0 = dot(d0, e) / sqrLen0
  const s0 = (vax * ex + vay * ey) / sqrLen0;
  //    s1 = s0 + dot(d0, d1) / sqrLen1
  const s1 = s0 + (vax * vbx + vay * vby) / sqrLen0;

  let w0 = 0;
  let w1 = 0;
  const smin = Math.min(s0, s1);
  const smax = Math.max(s0, s1);

  // inlined interval intersection
  const u0 = 0;
  const u1 = 1;

  // amount of interval intersections
  let imax = 0;

  if (u1 < smin || u0 > smax) imax = 0;
  else {
    if (u1 > smin) {
      if (u0 < smax) {
        w0 = u0 < smin ? smin : u0;
        w1 = u1 > smax ? smax : u1;
        imax = 2;
      } else {
        // u0 == smax
        w0 = u0;
        imax = 1;
      }
    } else {
      // u1 == smin
      w0 = u1;
      imax = 1;
    }
  }

  for (let i = 0; i < imax; i++) {
    const w = i === 0 ? w0 : w1;
    result[i][0] = p0x + w * vax;
    result[i][1] = p0y + w * vay;
  }

  return imax;
}

/**
 * Finds the magnitude of the cross product of two vectors (if we pretend
 * they're in three dimensions)
 */
const crossProduct = (ax: number, ay: number, bx: number, by: number) =>
  ax * by - ay * bx;

/**
 * Finds the dot product of two vectors.
 */
const dotProduct = (ax: number, ay: number, bx: number, by: number) =>
  ax * bx + ay * by;

const toPoint = (px: number, py: number, s: number, dx: number, dy: number) => [
  px + s * dx,
  py + s * dy,
];

/**
 * Finds the intersection (if any) between two line segments a and b, given the
 * line segments' end points a1, a2 and b1, b2.
 *
 * This algorithm is based on Schneider and Eberly.
 * http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf
 * Page 244.
 *
 * @param {Array.<Number>} a1 point of first line
 * @param {Array.<Number>} a2 point of first line
 * @param {Array.<Number>} b1 point of second line
 * @param {Array.<Number>} b2 point of second line
 * @returns {Array.<Array.<Number>>|Null} If the lines intersect, the point of
 * intersection. If they overlap, the two end points of the overlapping segment.
 * Otherwise, null.
 */
export function ii(a1: Point, a2: Point, b1: Point, b2: Point) {
  // The algorithm expects our lines in the form P + sd, where P is a point,
  // s is on the interval [0, 1], and d is a vector.
  // We are passed two points. P can be the first point of each pair. The
  // vector, then, could be thought of as the distance (in x and y components)
  // from the first point to the second point.
  // So first, let's make our vectors:
  const vax = a2[0] - a1[0];
  const vay = a2[1] - a1[1];
  const vbx = b2[0] - b1[0];
  const vby = b2[1] - b1[1];

  // We also define a function to convert back to regular point form:

  // The rest is pretty much a straight port of the algorithm.
  const ex = b1[0] - a1[0];
  const ey = b1[1] - a1[1];
  let kross = crossProduct(vax, vay, vbx, vby);
  let sqrKross = kross * kross;
  const sqrLenA = dotProduct(vax, vay, vax, vay);
  //const sqrLenB  = dotProduct(vb, vb);

  // Check for line intersection. This works because of the properties of the
  // cross product -- specifically, two vectors are parallel if and only if the
  // cross product is the 0 vector. The full calculation involves relative error
  // to account for possible very small line segments. See Schneider & Eberly
  // for details.
  if (sqrKross > 0 /* EPS * sqrLenB * sqLenA */) {
    // If they're not parallel, then (because these are line segments) they
    // still might not actually intersect. This code checks that the
    // intersection point of the lines is actually on both line segments.
    const s = crossProduct(ex, ey, vbx, vby) / kross;
    // not on line segment a
    if (s < 0 || s > 1) return null;

    const t = crossProduct(ex, ey, vax, vay) / kross;
    // not on line segment b
    if (t < 0 || t > 1) return null;

    // on an endpoint of line segment a
    if (s === 0 || s === 1) return [toPoint(a1[0], a1[1], s, vax, vay)];
    // on an endpoint of line segment b
    if (t === 0 || t === 1) return [toPoint(b1[0], b1[1], t, vbx, vby)];

    return [toPoint(a1[0], a1[1], s, vax, vay)];
  }

  // If we've reached this point, then the lines are either parallel or the
  // same, but the segments could overlap partially or fully, or not at all.
  // So we need to find the overlap, if any. To do that, we can use e, which is
  // the (vector) difference between the two initial points. If this is parallel
  // with the line itself, then the two lines are the same line, and there will
  // be overlap.
  //const sqrLenE = dotProduct(e, e);
  kross = crossProduct(ex, ey, vax, vay);
  sqrKross = kross * kross;

  // Lines are just parallel, not the same. No overlap.
  if (sqrKross > 0 /* EPS * sqLenB * sqLenE */) return null;

  const sa = dotProduct(vax, vay, ex, ey) / sqrLenA;
  const sb = sa + dotProduct(vax, vay, vbx, vby) / sqrLenA;
  const smin = Math.min(sa, sb);
  const smax = Math.max(sa, sb);

  // this is, essentially, the FindIntersection acting on floats from
  // Schneider & Eberly, just inlined into this function.
  if (smin <= 1 && smax >= 0) {
    // overlap on an end point
    if (smin === 1)
      return [toPoint(a1[0], a1[1], smin > 0 ? smin : 0, vax, vay)];

    if (smax === 0)
      return [toPoint(a1[0], a1[1], smax < 1 ? smax : 1, vax, vay)];

    // There's overlap on a segment -- two points of intersection. Return both.
    return [
      toPoint(a1[0], a1[1], smin > 0 ? smin : 0, vax, vay),
      toPoint(a1[0], a1[1], smax < 1 ? smax : 1, vax, vay),
    ];
  }

  return null;
}
