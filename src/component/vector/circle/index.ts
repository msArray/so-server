import { Vec2 } from "..";

export class Circle {
  p: Vec2; // Position
  r: number; // Radius

  constructor(p: Vec2, r: number) {
    this.p = p;
    this.r = r;
  }
}
