import * as PIXI from "pixi.js";
import { Person } from "./Person";
import { createTween } from "./tween";

export class Elevator {
  currFloor: number;

  capacity: number;
  places: number;

  people: Person[];

  sprite: PIXI.Container;

  private floorHeight: number;

  constructor(height: number, capacity: number) {
    this.capacity = capacity;
    this.places = capacity;

    this.sprite = this.CreateSprite(height);

    this.currFloor = 0;

    this.people = [];

    this.floorHeight = height;
  }

  private CreateSprite(height: number) {
    const container = new PIXI.Container();

    container.pivot.y=height;
    container.scale.y=-1;

    const rect = new PIXI.Graphics()
      .rect(0, 0, 100, height)
      .stroke({ width: 2, color: 0x000000 });

    container.addChild(rect);

    return container;
  }

  private Go(toY: number, duration = 1000, onComlpete?: () => void) {
    createTween(this.sprite).to({ y: toY }, duration).onComplete(onComlpete).start();
  }

  GoToFloor(targetFloor: number) {
    const delayPerFloor = 500;
    const speed = 1000;
    const elevator = this;

    function step() {
      if (elevator.currFloor === targetFloor) return; // базовий випадок

      const direction = targetFloor > elevator.currFloor ? 1 : -1;
      elevator.currFloor += direction;

      const toY = elevator.currFloor * elevator.floorHeight;

      // рухаємо ліфт
      elevator.Go(toY, speed); // 1000 = швидкість руху tween

      // чекаємо завершення tween + паузу, потім викликаємо наступний крок
      setTimeout(() => {
        step();
      }, speed + delayPerFloor);
    }

    step();
  }
}
