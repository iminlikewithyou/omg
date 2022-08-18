import io from "..";
import { BaseGame } from "../objects/BaseGame";
import { Player } from "../objects/Player";

export type YachtDicePlayer = {
  player: Player
  scores: number[]
  totalScore: number
}

export type YachtDiceGameState = {
  players: YachtDicePlayer[]
  turnIndex: number
  rollsRemaining: number
  dice: number[]
  heldDice: number[]
  hasRolled: boolean
}

export class YachtDiceGame extends BaseGame {
  gameState: YachtDiceGameState;

  startGame() {
    this.gameState = {
      players: [],
      turnIndex: 0,
      rollsRemaining: 3,
      dice: [null, null, null, null, null],
      heldDice: [],
      hasRolled: false
    }

    for (let player of this.room.players) {
      this.gameState.players.push({
        player: player,
        scores: [null, null, null, null, null, null, null, null, null, null],
        totalScore: 0
      });
    }

    io.to(this.room.ID).emit("updateState", this.gameState);
  }

  cleanup() {
  }
}

/*
playerJoined?: (player: Player) => void;
  playerQuit?: (player: Player) => void;
  cleanup?: () => void;
  */