import { Vec2, Circle, Segment } from "../../../vector";

export class player extends Circle {
  color: number;
  isMob: boolean;
  speed: number = 2;
  speedVec: Vec2 = new Vec2(0, 0);
  hash: string = Math.random().toString(36).slice(-8);

  constructor(size: number, color?: number, isMob?: boolean) {
    super(new Vec2(0, 0), size);
    this.r = size;
    this.color = color || 0xffffff * Math.random();
    if (isMob === undefined) this.isMob = true;
    else this.isMob = isMob;
    this.init();
  }

  init() {
    if (this.isMob) this.spawnMob(); // Circle Spawn Positioning
    else this.p = new Vec2(0, 0); // Circle Spawn Positioning (plobably Player)

    const Random = Math.random() * Math.PI * 2;
    if (this.isMob)
      this.speedVec = new Vec2(Math.cos(Random), Math.sin(Random)).mul(0.5);
    else this.speedVec = new Vec2(0, 0);
  }

  spawnMob() {
    const spawnX = this.r + Math.random() * (window.innerWidth - this.r * 2);
    const spawnY = this.r + Math.random() * (window.innerHeight - this.r * 2);

    this.p = new Vec2(spawnX, spawnY);
  }

  update(mouse?: Vec2) {
    if (!this.isMob) this.p = mouse ?? new Vec2(0, 0);
    else if(mouse) {
        this.speedVec.set(mouse.x - this.p.x, mouse.y - this.p.y);
        this.speedVec = this.speedVec.norm().mul(this.speed);
        this.p = this.p.add(this.speedVec)
    };
  }

  isHitPlayer(mobs: player[]) {
    for (const _b of mobs) {
      if (this.hash === _b.hash) continue;
      if (this.p.dist(_b.p) < this.r + _b.r) {
        let n = this.p.sub(_b.p).norm();
        this.speedVec = this.speedVec.sub(n.mul(2 * this.speedVec.dot(n)));
        this.p = _b.p.add(n.mul(this.r + _b.r));
      }
    }
  }

  isHitSegment(segs: Segment[]) {
    for (const _seg of segs) {
      let v1 = this.p.sub(_seg._start); // Vector from the Segment's Start to the Circle's Position
      let n = _seg.normVec();
      // Is Hit the straight line that extends the segment
      if (Math.abs(v1.dot(n)) >= this.r) continue; // Not Hit
      let v2 = this.p.sub(_seg._end); // Vector from the Segment's End to the Circle's Position
      // Have Circle between the Segment's Start and Segment's End
      if (v1.cross(n) > 0 && v2.cross(n) < 0) {
        // calculate the cross product with Segment's Normal Vector and check they are over 0 or under 0

        this.speedVec = this.speedVec.add(n.mul(-this.speedVec.dot(n) * 2));

        if (v1.dot(n) > 0) this.p = this.p.add(n.mul(this.r - v1.dot(n)));
        else this.p = this.p.add(n.mul(-this.r - v1.dot(n)));
      } else if (v1.sqMag() < this.r ** 2) {
        // Hit the Segment's Start
        n = v1.norm();
        this.speedVec = this.speedVec.add(n.mul(-this.speedVec.dot(n) * 2));
        this.p = _seg._start.add(n.mul(this.r));
      } else if (v2.sqMag() < this.r ** 2) {
        // Hit the Segment's End
        n = v2.norm();
        this.speedVec = this.speedVec.add(n.mul(-this.speedVec.dot(n) * 2));
        this.p = _seg._end.add(n.mul(this.r));
      }
    }
  }
}
