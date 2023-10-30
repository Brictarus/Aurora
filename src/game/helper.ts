import { Point, Rectangle } from '@core/common-types';

export const collisions = {
  isPointInRect: function (point: Point, rect: Rectangle) {
    return (point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h);
  },
  collides: function (o1: Rectangle, o2: Rectangle, t: number) {
    if (!t) t = 0;
    return !((o1.y + o1.h - 1 - t < o2.y + t) || (o1.y + t > o2.y + o2.h - 1 - t) || (o1.x + o1.w - 1 - t < o2.x + t) || (o1.x + t > o2.x + o2.w - 1 - t));
  },
  contains: function (o1: Rectangle, o2: Rectangle) {
    return (o1.y <= o2.y && o1.y + o1.h >= o2.y + o2.h && o1.x <= o2.x && o1.x + o1.w >= o2.x + o2.w);
  },
  canContain: function (o1: Rectangle, o2: Rectangle) {
    return (o1.w >= o2.w && o1.h >= o2.h);
  },
  isSmaller: function (o1: Rectangle, o2: Rectangle) {
    return (o1.w >= o2.w && o1.h >= o2.h);
  },
}