import { Vec2 } from "..";

export class Segment {
  _start: Vec2;
  _end: Vec2;

  constructor(start: Vec2, end: Vec2) {
    this._start = start;
    this._end = end;
  }

  normVec() {
    let b = this._end.sub(this._start).norm();
    return new Vec2(-b.y, b.x);
  }
}
