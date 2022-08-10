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
  sqrEpsilon = 1e-6
): number {
  // segments P0 + s * D0 for s in [0, 1], P1 + t * D1 for t in [0,1]

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

    const t = (ex * vay - ey * vax) / kross;

    // intersection of lines is not a point on segment P1 + t * D1
    if (t < 0 || t > 1) return 0;

    const res0 = result[0];
    // intersection of lines is a point on each segment
    if (s === 0 || s === 1) {
      // on an endpoint of line segment a
      res0[0] = p0x + s * vax;
      res0[1] = p0y + s * vay;
    } else if (t === 0 || t === 1) {
      // on an endpoint of line segment b
      res0[0] = p1x + t * vbx;
      res0[1] = p1y + t * vby;
    } else {
      res0[0] = p0x + s * vax;
      res0[1] = p0y + s * vay;
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

  if (imax > 0) {
    const res0 = result[0];
    res0[0] = p0x + w0 * vax;
    res0[1] = p0y + w0 * vay;

    if (imax === 2) {
      const res1 = result[1];
      res1[0] = p0x + w1 * vax;
      res1[1] = p0y + w1 * vay;
    }
  }

  return imax;
}
