import { GameCode } from '../GameDirectory';
import { Room } from './Room';

export class BaseGame {
  gameCode: GameCode;

  gameState: GameState;
  room: Room;

  constructor(room: Room) {
    this.room = room;

    // TODO?

    this.init();
  }

  init() {}
  cleanup?() {};
}

export type GameState = {
  [key: string]: any
}