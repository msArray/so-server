export class Vec2 {
    x: number;
    y: number;
  
    constructor(_x: number, _y: number) {
      this.x = _x;
      this.y = _y;
    }
  
    get() {
      return { x: this.x, y: this.y };
    }
  
    set(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  
    set_x(val: number) {
      this.x = val;
    }
  
    set_y(val: number) {
      this.y = val;
    }
  
    get_x() {
      return this.x;
    }
  
    get_y() {
      return this.y;
    }
  
    getDeg() {
      return (Math.atan2(this.y, this.x) * 180) / Math.PI;
    }
  
    getRad() {
      return Math.atan2(this.y, this.x);
    }
  
    copy() {
      return new Vec2(this.x, this.y);
    }
  
    add(v: Vec2) {
      return new Vec2(this.x + v.x, this.y + v.y);
    }
  
    sub(v: Vec2) {
      return new Vec2(this.x - v.x, this.y - v.y);
    }
  
    mul(s: number) {
      return new Vec2(this.x * s, this.y * s);
    }
  
    dot(v: Vec2) {
      return this.x * v.x + this.y * v.y;
    }
  
    cross(v: Vec2) {
      return this.x * v.y - this.y * v.x;
    }
  
    div(s: number) {
      return new Vec2(this.x / s, this.y / s);
    }
  
    dist(v: Vec2) {
      return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }
  
    mag() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
  
    sqMag() {
      return this.x ** 2 + this.y ** 2;
    }
  
    norm() {
      return this.div(this.mag());
    }
  }