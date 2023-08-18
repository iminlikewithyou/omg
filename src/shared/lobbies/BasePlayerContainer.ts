import { TeamSettings, WeightType } from "./TeamTypes";
import { BasePlayer } from "./BasePlayer";
import { NetworkObject } from "../network/NetworkObject";

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

export class BasePlayerContainer extends NetworkObject {
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

  // this is only useful in the server
  // private checkTeams(): void {
  //   if (this.teams.length === 0) this.teams.push(new Team(DEFAULT_TEAM_SETTINGS));
  // }

  // seems only useful in the server
  private getCombinedWeight(): number {
    // combine all team weights from teams with weight type weight
    return this.teams.reduce((total, team) => {
      if (team.balanceType === WeightType.WEIGHT) return total + team.balanceWeight;
      return total;
    }, 0);
  }

  // can be useful on the client possibly
  private isTeamFull(team: Team): boolean {
    switch (team.balanceType) {
      case WeightType.PERCENTAGE:
        return team.players.length + 1 > team.balanceWeight * this.playerInfo.length;
      case WeightType.WEIGHT:
        let combinedWeight = this.getCombinedWeight();
        if (combinedWeight === 0) return false;
        return team.players.length + 1 > (team.balanceWeight / combinedWeight) * this.playerInfo.length;
      default:
        return false;
    }
  }

  hasPlayer(player: BasePlayer): boolean {
    // todo check this
    return this.playerInfo.some(playerInfo => playerInfo.player === player);
  }

  // only seems useful on the server
  getAvailableTeams(): Team[] {
    return this.teams.filter(team => !this.isTeamFull(team));
  }

  // only seems useful on the server - tied to the above
  getNextAvailableTeam(): Team {
    let availableTeams = this.getAvailableTeams();
    if (availableTeams.length === 0) return null;
    // get a random team
    return availableTeams[Math.floor(Math.random() * availableTeams.length)];
  }

  // only seems useful on the server
  getTeamlessPlayers(): Player[] {
    return this.playerInfo.map(playerInfo => playerInfo.player).filter(player => !this.getTeamOf(player));
  }

  // server only - client can simply update the playerinfo and team data
  // addPlayerToTeam(player: Player, newTeam: Team): PlayerQueueResult {
  //   if (newTeam.isInQueue(player)) return PlayerQueueResult.ALREADY_IN_QUEUE;
  //   if (newTeam.hasPlayer(player)) return PlayerQueueResult.ALREADY_ON_TEAM;
    
  //   if (this.isTeamFull(newTeam)) {
  //     // team is full, add to queue
  //     newTeam.unsafeAddToQueue(player);
  //     return PlayerQueueResult.ADDED_TO_QUEUE;
  //   }

  //   // team is not full, add to team
  //   let oldTeam = this.getTeamOf(player);
  //   newTeam.unsafeAddPlayer(player);

  //   if (oldTeam) {
  //     oldTeam.unsafeRemovePlayer(player);

  //     // if the old team has a player in queue, add them to the team
  //     let playerToMove = oldTeam.queue.shift();
  //     if (playerToMove) {
  //       oldTeam.unsafeAddPlayer(playerToMove);
  //     }
  //   }

  //   // TODO the old player needs to be removed from their current team and the process needs to be repeated for that team

  //   // needs to return players who were moved
  //   return PlayerQueueResult.ADDED_TO_TEAM;
  // }

  // server only
  // forcePlayersIntoTeams(): void {
  //   // get all players who aren't in a team yet
  //   let playersWithoutTeam = this.getTeamlessPlayers();

  //   // put all players into the next available team
  //   for (let player of playersWithoutTeam) {
  //     let team = this.getNextAvailableTeam();
  //     if (!team) break;
  //     team.players.push(player);
  //   }

  //   // watch the team queues - when a player is placed in a team, queues need to be updated

  // }

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

    // remove player from team
    for (let team of this.teams) {
      if (team.hasPlayer(player)) {
        team.players.splice(team.players.indexOf(player), 1);
        break;
      }
    }
  }

  getTeamOf(player: BasePlayer): Team {
    for (let team of this.teams) {
      if (team.hasPlayer(player)) return team;
    }
    return null;
  }

  // toJSON() {
  //   return {
  //     teams: this.teams,
  //     playerInfo: this.playerInfo
  //   }
  // }

  // static fromJSON(json: any) {
  //   let container = new BasePlayerContainer();

  //   container.teams = json.teams;
  //   container.playerInfo = json.playerInfo;
  // }
}