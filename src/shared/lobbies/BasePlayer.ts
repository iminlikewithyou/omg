import { Entity } from "./Entity";

export class BasePlayer implements Entity {
  ID: number;
  name: string;
  color: number;

  constructor(ID: number, name: string, color: number) {
    this.ID = ID;
    this.name = name;
    this.color = color;
  }

  getPlayers(): BasePlayer[] {
    return [this];
  }

  // toJSON() {
  //   return {
  //     ID: this.ID,
  //     name: this.name
  //   }
  // }
}