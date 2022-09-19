use wasm_bindgen::prelude::*;
use geo_types::{Coordinate};
use js_sys::Array;

pub enum Intersection
{
    None,
    Point(Array),
    Overlap(Array, Array),
}


#[wasm_bindgen]
pub fn intersection(
  p0x: f64,
  p0y: f64,
  d0x: f64,
  d0y: f64,
  p1x: f64,
  p1y: f64,
  d1x: f64,
  d1y: f64) -> Array {
  let out = Array::new_with_length(5);
  let sqr_epsilon = 1e-6;

  let vax = d0x - p0x;
  let vay = d0y - p0y;
  let vbx = d1x - p1x;
  let vby = d1y - p1y;

  let ex = p1x - p0x;
  let ey = p1y - p0y;

  let kross = vax * vby - vay * vbx;
  let sqr_kross = kross * kross;

  let sqr_len0 = vax * vax + vay * vay;
  let sqr_len1 = vbx * vbx + vby * vby;


  if sqr_kross > sqr_epsilon * sqr_len0 * sqr_len1 {
    // lines of the segments are not parallel
    let s = (ex * vby - ey * vbx) / kross;

    // intersection of lines is not a point on segment P0 + s * D0
    if s < 0.0 || s > 1.0 { return out };

    let t = (ex * vay - ey * vax) / kross;

    // intersection of lines is not a point on segment P1 + t * D1
    if t < 0.0 || t > 1.0 { return out };

    let res0x: f64;
    let res0y: f64;
    // intersection of lines is a point on each segment
    if s == 0.0 || s == 1.0 {
      // on an endpoint of line segment a
      res0x = p0x + s * vax;
      res0y = p0y + s * vay;
    } else if t == 0.0 || t == 1.0 {
      // on an endpoint of line segment b
      res0x = p1x + t * vbx;
      res0y = p1y + t * vby;
    } else {
      res0x = p0x + s * vax;
      res0y = p0y + s * vay;
    }
    out.set(0, (1.0).into());
    out.set(1, res0x.into());
    out.set(2, res0y.into());
    return out;
  }
  return out;
}
