import { TeamSettings } from "./TeamTypes";
import { BasePlayer } from "./BasePlayer";

export type PlayerInfo = {
  player: BasePlayer;
  nickname: string;
  color: number;
  grayed: boolean;
  prefix: string;
}

// export type Team = TeamSettings & {
//   players: number;
//   queue: number;
// }

export class BasePlayerContainer {
  teams: Team[];
  // teamBalancing: boolean; // is this replicated? maybe client doesn't see
  // respectGroupStick: boolean = true; // is this replicated? maybe client doesn't see

  playerInfo: PlayerInfo[];

  // no constructor because you can just add everything normally
  // usually you don't need to pass in anything
  
  // playerInfo: PlayerInfo[], teams: Team[]
  // constructor() {
  //   this.playerInfo = playerInfo;
  //   this.teams = teams;
  // }

  get length(): number {
    return this.playerInfo.length;
  }

  get players(): BasePlayer[] {
    return this.playerInfo.map(playerInfo => playerInfo.player);
  }

  hasPlayer(player: BasePlayer): boolean {
    // todo check this
    return this.playerInfo.some(playerInfo => playerInfo.player === player);
  }

  addPlayer(player: BasePlayer): void {
    this.playerInfo.push({
      player,
      nickname: null,
      color: null,
      grayed: false,
      prefix: null
    });
  }

  removePlayer(player: BasePlayer): void {
    let index = this.playerInfo.findIndex(playerInfo => playerInfo.player === player);
    if (index === -1) return;

    this.playerInfo.splice(index, 1);
  }
}