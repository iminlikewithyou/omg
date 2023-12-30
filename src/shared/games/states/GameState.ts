// type OmitMethods<T, K extends keyof T> = Omit<T, K>;

import { BaseLobby } from "@shared/lobbies/BaseLobby";

type FunctionParamsAndName<T, K extends keyof T> = T[K] extends (...args: any[]) => any ? {type: K, payload: Parameters<T[K]>} : never;

export type DeltaUpdate<T> = { [K in keyof T]: FunctionParamsAndName<T, K> }[keyof T];

// type BaseGameStateOmitted = OmitMethods<GameState, 'resetGame'>;
// type BaseDeltaUpdate = DeltaUpdate<TestGameState>;

abstract class GameStateController {
  gameState: { [key: string]: any };
  lobby: BaseLobby;

  emitState() {
    
  }
}

export class TestGameState {
  // players: Player[] = [];

  resetGame() {

  }

  movePlayer(id: string, newPosition: { x: number, y: number }) {
    // const player = this.players.find(p => p.id === id);
    // if (player) {
    //   player.position = newPosition;
    // }

    // let delta: BaseDeltaUpdate = {
    //   type: "movePlayer",
    //   payload: [id, newPosition]
    // };
  }

  // ...more methods...
}

type ChessDeltaUpdate = DeltaUpdate<ChessGameState>;

export class ChessGameState extends GameStateController {
  firstTurn: boolean = true;

  movePiece(id: string, newPosition: { x: number, y: number }) {
    // const piece = this.pieces.find(p => p.id === id);
    // if (piece) {
    //   piece.position = newPosition;
    // }

    let delta: ChessDeltaUpdate = {
      type: "movePiece",
      payload: [id, newPosition]
    };
  }

  // ...more methods...
}