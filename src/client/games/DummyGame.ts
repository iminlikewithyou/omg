import { Game } from "./classes/Game";

export type DummyGameState = {}

export class DummyGame extends Game {
  declare gameState: DummyGameState;

  init() {}
}