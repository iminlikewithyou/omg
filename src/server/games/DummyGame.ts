import { Game } from "./classes/Game";
import { GameStateController } from "./states/GameState";
import { AutoEmitDelta, NoEmit } from "./states/decorators/EmitDelta";

// export type DummyGameState = {}

@AutoEmitDelta
export class DummyGameState extends GameStateController {
  
  // this class can't be part of the DummyGame because
  // it requires @AutoEmit and @NoEmit decorators
  // which would apply to the entire DummyGame class and
  // not the specific ones that matter

  // also this needs to be shared between Client/Server
  
  gameState = {
    epicNumber: 0
  };

  // since this class has the AutoEmitDelta decorator,
  // all methods will automatically emit a delta

  // this should automatically emit addOne to all players
  public addOne() {
    this.gameState.epicNumber++;
  }

  // to test if NoEmit works - this should not emit addOneButStupid
  @NoEmit
  public addOneButStupid() {
    this.gameState.epicNumber++;
  }

  // would like an updateState function
  // most likely in GameStateController
}

export class DummyGame extends Game {
  declare gameState: DummyGameState; // hoping and praying
  
  timer;

  start() {
    // this.timer = setTimeout(() => {
    //   this.endGame();
    // }, 5000);
  }

  cleanup() {
    clearTimeout(this.timer);
  }
}