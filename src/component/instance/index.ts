import { stdin as input, stdout as output } from "process";
import * as readline from "readline";
import { Segment, Circle, Vec2 } from "../vector";
import { player } from "./objects";

interface IInstance {
  name?: string;
  size:
    | {
        width: number;
        height: number;
      }
    | number;
}

export class server {
  name: string;
  size: {
    width: number;
    height: number;
  } = {
    width: 10000,
    height: 10000,
  };
  world: any[] = [];
  rl = readline.createInterface({ input, output });

  constructor(options?: IInstance) {
    this.name = options?.name || "server";
    if (typeof options?.size === "number") {
      this.size.width = options.size;
      this.size.height = options.size;
    } else if (
      typeof options?.size === "object" &&
      options?.size.width &&
      options?.size.height
    ) {
      this.size.width = options?.size.width;
      this.size.height = options?.size.height;
    }

    this.init();
  }

  init() {
    this.world.push(
      new Segment(
        new Vec2(-this.size.width / 2, -this.size.height / 2),
        new Vec2(this.size.width / 2, -this.size.height / 2)
      ),
      new Segment(
        new Vec2(-this.size.width / 2, -this.size.height / 2),
        new Vec2(-this.size.width / 2, this.size.height / 2)
      ),
      new Segment(
        new Vec2(-this.size.width / 2, this.size.height / 2),
        new Vec2(this.size.width / 2, this.size.height / 2)
      ),
      new Segment(
        new Vec2(this.size.width / 2, -this.size.height / 2),
        new Vec2(this.size.width / 2, this.size.height / 2)
      )
    );
    this.cli();
  }

  update(hash: string, mouse?: Vec2) {
    const player = this.world.find((obj) => obj.hash === hash);
    if (player) {
      player.update(mouse);
      player.isHitPlayer(this.world.filter((obj) => obj instanceof player));
      player.isHitSegment(this.world.filter((obj) => obj instanceof Segment));
    }
  }

  spawnPlayer() {
    const newPlayer = new player(10, undefined, false);
    this.world.push(newPlayer);
    this.rl.write(`new Player ${newPlayer.hash} Spawned\n`);
    return newPlayer;
  }

  cli() {
    console.log("\x1b[37;42m Server CLI \x1b[0;49m");
    this.standingCli();
  }

  standingCli() {
    this.rl.question("\x1b[33m>\x1b[0m", (answer) => {
      this.rl.write(answer);
      const command = answer.split(" ");
      if (command[0] === "spawn") {
        this.spawnPlayer();
        this.standingCli();
      } else if (command[0] === "ls") {
        if (command[1] == "-a") {
          this.world.forEach((obj) => {
            if (obj instanceof player) {
              this.rl.write(
                `Player ${obj.hash} Position: ${obj.p.x}, ${obj.p.y} Size:${obj.r}\n`
              );
            } else if (obj instanceof Segment) {
              this.rl.write(
                `Segment Start: ${obj._start.x}, ${obj._start.y} End: ${obj._end.x}, ${obj._end.y}\n`
              );
            }
          });
        } else {
          this.world.forEach((obj) => {
            if (obj instanceof player) {
              this.rl.write(
                `Player ${obj.hash} Position: ${obj.p.x}, ${obj.p.y} Size:${obj.r}\n`
              );
            }
          });
        }

        this.standingCli();
      } else if (command[0] === "exit") {
        this.rl.close();
        process.on("exit", function () {
          process.exit(1);
        });
        return;
      } else {
        this.standingCli();
      }
    });
  }
}
