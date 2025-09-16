import * as PIXI from "pixi.js";
import { Person } from "./Person";
import { createTween } from "./tween";
import type { Floor } from "./Floor";
import { floors } from "./main";

export class Elevator {
  currFloor: number;

  capacity: number;
  places: number;

  people: Person[];

  sprite: PIXI.Container;

  direction: 1 | 0 | -1 = 0;

  private floorHeight: number;
  private width: number;

  constructor(height: number, width: number, capacity: number) {
    this.capacity = capacity;
    this.places = capacity;

    this.sprite = this.CreateSprite(height, width);

    this.currFloor = 0;

    this.people = [];

    this.floorHeight = height;
    this.width = width;
  }

  private CreateSprite(height: number, width: number) {
    const container = new PIXI.Container();

    const rect = new PIXI.Graphics()
      .rect(0, 0, width, height)
      .stroke({ width: 2, color: 0x000000 });

    container.addChild(rect);

    return container;
  }

  private Go(toY: number, duration = 1000, onComlpete?: () => void) {
    createTween(this.sprite)
      .to({ y: toY }, duration)
      .onComplete(onComlpete)
      .start();
  }

  GoToFloor(TargetFloor: number) {
    let targetFloor = TargetFloor;
    const delayPerFloor = 800;
    const speed = 1000;
    const elevator = this;

    function step() {
      if (elevator.currFloor === targetFloor) {
        elevator.direction = 0;
        elevator.CheckFloor(floors[targetFloor]);

        const people = elevator.people.filter(
          (p) => p.targetFloor === elevator.currFloor
        );
        people.forEach((p) => elevator.GetPerson(p));

        const targetFloors = elevator.people.map((p) => p.targetFloor);
        if (targetFloors.length > 0) {
          targetFloor =
            elevator.direction >= 0
              ? Math.max(...targetFloors)
              : Math.min(...targetFloors);
          elevator.direction = targetFloor > elevator.currFloor ? 1 : -1;
          setTimeout(step, delayPerFloor);
        } else {
          const nearest = elevator.GetNearestFloorWithPeople();
          if (nearest !== -1 && nearest !== elevator.currFloor) {
            targetFloor = nearest;
            elevator.direction = targetFloor > elevator.currFloor ? 1 : -1;
            setTimeout(step, delayPerFloor);
          }
        }

        return;
      }

      elevator.direction = targetFloor > elevator.currFloor ? 1 : -1;
      elevator.currFloor += elevator.direction;
      const toY = elevator.currFloor * elevator.floorHeight;

      elevator.Go(toY, speed, () => {
        elevator.CheckFloor(floors[elevator.currFloor]);

        const people = elevator.people.filter(
          (p) => p.targetFloor === elevator.currFloor
        );
        people.forEach((p) => elevator.GetPerson(p));

        setTimeout(step, delayPerFloor);
      });
    }

    step();
  }

  CheckFloor(floor: Floor) {
    const canEnterPeople = floor.people.filter((p) => p.canEnter);

    for (const p of canEnterPeople) {
      if (this.places === 0) break;

      // перевірка на напрямок
      if (this.direction === 0 || p.direction === this.direction) {
        const pers = floor.getPersonByObject(p); 
        if (pers) this.PutPerson(pers);
      }
    }
  }

  PutPerson(person: Person) {
    if (this.people.length >= this.capacity) return;

    this.people.push(person);
    this.places--;

    this.sprite.addChild(person.sprite);

    person.sprite.x += this.width;

    const index = this.people.length - 1;
    const col = index % 2;
    const row = Math.floor(index / 2);
    const spacingX = 30;
    const spacingY = 40;

    person.Go(col * spacingX + 10, 200, () => {
      person.sprite.y = spacingY * row;
    });
  }

  GetPerson(pers: Person) {
    if (this.places < this.capacity) this.places++;
    pers.sprite.y = 0;
    this.sprite.removeChild(pers.sprite);
    this.people = this.people.filter((p) => p !== pers);

    floors[pers.targetFloor].putPerson(pers);
  }

  GetNearestFloorWithPeople() {
    let nearestIndex = -1;
    let minDistance = Infinity;

    floors.forEach((floor, index) => {
      if (floor.people.length > 0) {
        const distance = Math.abs(this.currFloor - index);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      }
    });

    return nearestIndex;
  }
}
