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
const CAPACITY = 3;

const ELEVATOR_WIDTH = 100;

const floors: Floor[] = [];

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

  SpawnPeople();

  const elevator = new Elevator(floorHeight, CAPACITY);

  scene.addChild(elevator.sprite);

  // ! TEST FORM 
  const form = document.getElementById("floorForm") as HTMLFormElement | null;
  const input = document.getElementById(
    "floorInput"
  ) as HTMLInputElement | null;

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!input) return;

    const floor = parseInt(input.value, 10);
    if (!isNaN(floor) && floor < floors.length && floor >= 0) {
      elevator.GoToFloor(floor);
    }
  });
  
}

function SpawnPeople() {
  setInterval(() => {
    const person = new Person(FLOORS);

    if (!floors[person.spawnFloor] || !floors[person.targetFloor]) {
      return;
    }

    floors[person.spawnFloor].people.push(person);
    floors[person.spawnFloor].container.addChild(person.sprite);

    person.sprite.x = WIDTH + 50;

    person.Go(10 + (floors[person.spawnFloor].people.length - 1) * 25);
  }, 4000);
}
