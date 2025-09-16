import * as PIXI from "pixi.js";
import { tweenGroup } from "./tween";
import { Floor } from "./Floor";
import { Person } from "./Person";
import { Elevator } from "./Elevator";

const app = new PIXI.Application();
const scene = app.stage;

const WIDTH = 800;
const HEIGHT = 600;

const FLOORS = 6;
const CAPACITY = 4;

export const ELEVATOR_WIDTH = 100;

export const floors: Floor[] = [];

(async () => {
  await app.init({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0xe2e2e2,
  });

  (document.querySelector("#pixi") || document.body).appendChild(app.canvas);

  app.stage.scale.y = -1;
  app.stage.y = app.renderer.height;

  Init();

  app.ticker.add(() => {
    tweenGroup.update();
  });
})();

function Init() {
  const floorHeight = HEIGHT / FLOORS;

  for (let i = 0; i < FLOORS; i++) {
    const floor = new Floor(floorHeight, WIDTH - ELEVATOR_WIDTH);
    floor.container.y = floorHeight * i;
    floor.container.x = ELEVATOR_WIDTH;

    floors.push(floor);

    scene.addChild(floor.container);
  }

  
  const elevator = new Elevator(floorHeight, ELEVATOR_WIDTH, CAPACITY);

  (window as any)["ELEVATOR"] = elevator;
  
  scene.addChild(elevator.sprite);
  
  SpawnPeople(GetPeople, elevator);
}

function SpawnPeople(callback: (arg:Elevator) => void, elevator:Elevator) {
  let firstSpawned = false;
  function spawn() {
    const person = new Person(FLOORS);

    if (!floors[person.spawnFloor] || !floors[person.targetFloor]) {
      scheduleNextSpawn();
      return;
    }

    floors[person.spawnFloor].people.push(person);
    floors[person.spawnFloor].container.addChild(person.sprite);

    person.sprite.x = WIDTH + 50;

    person.Go(
      10 + (floors[person.spawnFloor].people.length - 1) * 25,
      2000,
      () => {
        person.canEnter = true;

        if (!firstSpawned) {
          firstSpawned = true;

          callback(elevator);
        }

        if (elevator.direction === 0 && elevator.places === elevator.capacity) {
          elevator.GoToFloor(person.spawnFloor);
        }
      }
    );

    scheduleNextSpawn();
  }

  function scheduleNextSpawn() {
    const delay = 4000 + Math.random() * 6000; 
    setTimeout(spawn, delay);
  }

  scheduleNextSpawn();
}

function GetPeople(elevator: Elevator) {
  let floor: number | null = elevator.GetNearestFloorWithPeople();

  if (floor) {
    elevator.GoToFloor(floor);
  }

}
