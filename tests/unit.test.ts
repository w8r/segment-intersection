import { describe, expect, it } from 'vitest';
import { findIntersection, result } from '../src';

describe('segment intersection', () => {
  it('should return 0 for no intersections: 45 degrees parallel', () => {
    const isect = findIntersection(0, 0, 1, 1, 1, 0, 2, 2);
    expect(isect).toBe(0);
  });

  it('should return 0 for no intersections: different angle', () => {
    const isect = findIntersection(0, 0, 1, 1, 1, 0, 10, 2);
    expect(isect).toBe(0);
  });

  it('should return 0 for no intersections: different angle', () => {
    const isect = findIntersection(2, 2, 3, 3, 0, 6, 2, 4);
    expect(isect).toBe(0);
  });

  it('1 intersection', () => {
    const isect = findIntersection(0, 0, 1, 1, 1, 0, 0, 1);
    expect(isect).toBe(1);
    expect(result[0][0]).toBe(0.5);
    expect(result[0][1]).toBe(0.5);
  });

  it('shared point 1', () => {
    const isect = findIntersection(0, 0, 1, 1, 0, 1, 0, 0);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([0, 0]);
  });

  it('shared point 2', () => {
    const isect = findIntersection(0, 0, 1, 1, 0, 1, 1, 1);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([1, 1]);
  });

  it('T-crossing', () => {
    const isect = findIntersection(0, 0, 1, 1, 0.5, 0.5, 1, 0);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([0.5, 0.5]);
  });

  it('full overlap', () => {
    const isect = findIntersection(0, 0, 10, 10, 1, 1, 5, 5);
    expect(isect).toBe(2);
    expect(result[0]).toStrictEqual([1, 1]);
    expect(result[1]).toStrictEqual([5, 5]);
  });

  it('shared point + overlap', () => {
    const isect = findIntersection(1, 1, 10, 10, 1, 1, 5, 5);
    expect(isect).toBe(2);
    expect(result[0]).toStrictEqual([1, 1]);
    expect(result[1]).toStrictEqual([5, 5]);
  });

  it('mutual overlap', () => {
    const isect = findIntersection(3, 3, 10, 10, 0, 0, 5, 5);
    expect(isect).toBe(2);
    expect(result[0]).toStrictEqual([3, 3]);
    expect(result[1]).toStrictEqual([5, 5]);
  });

  it('full overlap', () => {
    const isect = findIntersection(0, 0, 1, 1, 0, 0, 1, 1);
    expect(isect).toBe(2);
    expect(result[0]).toStrictEqual([0, 0]);
    expect(result[1]).toStrictEqual([1, 1]);
  });

  it('full overlap, orientation', () => {
    const isect = findIntersection(1, 1, 0, 0, 0, 0, 1, 1);
    expect(isect).toBe(2);
    expect(result[0]).toStrictEqual([1, 1]);
    expect(result[1]).toStrictEqual([0, 0]);
  });

  it('collinear, shared point', () => {
    const isect = findIntersection(0, 0, 1, 1, 1, 1, 2, 2);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([1, 1]);
  });

  it('collinear, shared other point', () => {
    const isect = findIntersection(1, 1, 0, 0, 1, 1, 2, 2);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([1, 1]);
  });

  it('collinear, no overlap', () => {
    const isect = findIntersection(0, 0, 1, 1, 2, 2, 4, 4);
    expect(isect).toBe(0);
  });

  it('parallel', () => {
    const isect = findIntersection(0, 0, 1, 1, 0, -1, 1, 0);
    expect(isect).toBe(0);
  });

  it('parallel, orientation', () => {
    const isect = findIntersection(1, 1, 0, 0, 0, -1, 1, 0);
    expect(isect).toBe(0);
  });

  it('parallel, vertical position', () => {
    const isect = findIntersection(0, -1, 1, 0, 0, 0, 1, 1);
    expect(isect).toBe(0);
  });

  it('shared one endpoint', () => {
    const isect = findIntersection(0, 0, 1, 1, 1, 1, 2, 1);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([1, 1]);
  });

  it('normal values', () => {
    const isect = findIntersection(60, 180, 920, 180, 400, 140, 400, 260);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([400, 180]);
  });

  it('normal values 2', () => {
    const isect = findIntersection(820, 200, 620, 280, 620, 200, 820, 280);
    expect(isect).toBe(1);
    expect(result[0]).toStrictEqual([720, 240]);
  });

  it('edge cases', () => {
    expect(findIntersection(0.5, 0, 1, 0, 0, -1, 0, 1)).toBe(0);
    expect(findIntersection(0, 0, 1, 0, 0, -1, 0, 1));
    // fails
    expect(
      findIntersection(0, 0, 100000000000000020000, 1e-12, 1, 0, 1e20, 1e-11)
    ).toBe(2);
    // fails due to floating point error
    expect(
      findIntersection(
        0,
        0,
        1e20,
        1e-11,
        1,
        0,
        100000000000000020000,
        1e-12,
        1e-20
      )
    ).toBe(2);
  });
});
