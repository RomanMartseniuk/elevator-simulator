import { Tween, Group } from "@tweenjs/tween.js";

export const tweenGroup = new Group();

export function createTween<T extends object>(target: T): Tween<T> {
  const tween = new Tween(target, tweenGroup);
  tweenGroup.add(tween);
  return tween;
}
