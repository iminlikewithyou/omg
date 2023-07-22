import { NetworkObject } from "./NetworkObject";

let classMap: { [type: string]: typeof NetworkObject } = {};

export function register(Class: typeof NetworkObject, type: string): void {
  classMap[type] = Class;
}

export function getClass(type: string): typeof NetworkObject | undefined {
  return classMap[type];
}
