import * as PIXI from "pixi.js";
import { Person } from "./Person";

export class Floor {
  people: Person[];

  container: PIXI.Container;

  constructor(height: number, width: number) {
    this.people = [];

    this.container = this.CreateContainer(width, height);
  }

  private CreateContainer(width: number, height: number) {
    const container = new PIXI.Container();

    const rect = new PIXI.Graphics()
      .rect(0, 0, width, height)
      .fill({ color: 0xff0000 }); // червоний для тесту

    const floor = new PIXI.Graphics()
      .rect(0, 0, width, 2)
      .fill({ color: 0x000000 });

    container.addChild(rect);
    container.addChild(floor);

    return container;
  }
}
