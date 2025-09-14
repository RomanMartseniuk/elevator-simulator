import * as PIXI from "pixi.js";
import { createTween } from "./tween";

export class Person {
  spawnFloor: number;
  targetFloor: number;

  direction: boolean; // 1-up | 0-down
  canEnter: boolean;

  sprite: PIXI.Container;


  constructor(floors: number) {
    this.spawnFloor = Math.floor(Math.random() * floors);
    do {
      this.targetFloor = Math.floor(Math.random() * floors);
    } while (this.targetFloor === this.spawnFloor);

    this.direction = this.targetFloor > this.spawnFloor;
    this.canEnter = false;

    this.sprite = this.CreateSprite();
  }

  private CreateSprite() {
    const container = new PIXI.Container();

    const strokeColor = this.direction ? 0x427ef5 : 0x48f542;

    const rect = new PIXI.Graphics()
      .rect(0, 0, 20, 40)
      .stroke({ width: 2, color: strokeColor });

    const style = new PIXI.TextStyle({ fontSize: 14 });

    const text = new PIXI.Text({text: this.targetFloor + 1, style});

    container.addChild(rect);
    container.addChild(text);

    container.scale.y = -1;
    container.pivot.y=40;

    return container;
  }

  Go(toX: number, duration = 2000) {
    createTween(this.sprite).to({x: toX}, duration).start();
  }
}
