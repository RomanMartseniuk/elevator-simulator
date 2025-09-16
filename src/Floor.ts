import * as PIXI from "pixi.js";
import { Person } from "./Person";
import { ELEVATOR_WIDTH } from "./main";

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
      .fill({ color: 0xe2e2e2 });

    const floor = new PIXI.Graphics()
      .rect(0, 0, width, 2)
      .fill({ color: 0x000000 });

    container.addChild(rect);
    container.addChild(floor);

    return container;
  }

  getPerson(i: number) {
    const pers = this.people[i];
    if (!pers) return null;

    this.people.splice(i, 1);
    this.container.removeChild(pers.sprite);

    this.people.forEach((p, index) => {
      const targetX = 10 + index * 25;

      p.Go(targetX, 200);
    });

    return pers;
  }

  getPersonByObject(person: Person): Person | null {
    const index = this.people.indexOf(person);
    if (index === -1) return null;

    const pers = this.people.splice(index, 1)[0];
    this.container.removeChild(pers.sprite);
    return pers;
  }

  putPerson(pers: Person) {
    this.container.addChild(pers.sprite);

    pers.sprite.x -= ELEVATOR_WIDTH;

    pers.Go(1000, 1500, () => {
      this.container.removeChild(pers.sprite);
      pers.sprite.destroy();
    });
  }
}
