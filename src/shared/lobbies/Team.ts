import { GroupStickRespect, PickOrder, PlayerAbductionSetting, TeamConfig, TeamJoinSetting, TeamSettings, WeightType } from "./TeamTypes";
import { Entity } from "./Entity";
import { BasePlayer } from "./BasePlayer";

// why have this if there is already DEFAULT_TEAM_SETTINGS?
// maybe different places use different default configs
export const DEFAULT_TEAM_CONFIG: TeamConfig = {
  name: "Players",
  color: 0x2afa23,

  canTeamChat: false
}

// maybe make the TeamSettings its own object
// then if someone wants to save teams it's easier too

// also if TeamSettings is used in other places then
// all that default-setting stuff can be reused rather
// than sticking it all in the Team class

export class Team implements Entity, TeamSettings {
  // Entity
  name: string;
  color: number;

  // TeamSettings
  joinSetting: TeamJoinSetting;
  balanceType: WeightType;
  balanceWeight: number;
  requiredPlayersType: WeightType;
  requiredPlayersWeight: number;
  maxPlayersType: WeightType;
  maxPlayersWeight: number;
  playerAbductionSetting: PlayerAbductionSetting;
  pickOrder: PickOrder;
  groupStickRespect: GroupStickRespect;
  hiddenPlayers: boolean;
  canTeamChat: boolean;
  ephemeral: boolean;

  players: BasePlayer[];
  queue: BasePlayer[];

  constructor(teamSettings: TeamSettings) {
    // is this really the best way to do this?
    // come on
    this.name = teamSettings.name || DEFAULT_MERGE_SETTINGS.name;
    this.color = teamSettings.color || DEFAULT_MERGE_SETTINGS.color;
    this.joinSetting = teamSettings.joinSetting || DEFAULT_MERGE_SETTINGS.joinSetting;
    this.balanceType = teamSettings.balanceType || DEFAULT_MERGE_SETTINGS.balanceType;
    this.balanceWeight = teamSettings.balanceWeight || DEFAULT_MERGE_SETTINGS.balanceWeight;
    this.requiredPlayersType = teamSettings.requiredPlayersType || DEFAULT_MERGE_SETTINGS.requiredPlayersType;
    this.requiredPlayersWeight = teamSettings.requiredPlayersWeight || DEFAULT_MERGE_SETTINGS.requiredPlayersWeight;
    this.maxPlayersType = teamSettings.maxPlayersType || DEFAULT_MERGE_SETTINGS.maxPlayersType;
    this.maxPlayersWeight = teamSettings.maxPlayersWeight || DEFAULT_MERGE_SETTINGS.maxPlayersWeight;
    this.playerAbductionSetting = teamSettings.playerAbductionSetting || DEFAULT_MERGE_SETTINGS.playerAbductionSetting;
    this.pickOrder = teamSettings.pickOrder || DEFAULT_MERGE_SETTINGS.pickOrder;
    this.groupStickRespect = teamSettings.groupStickRespect || DEFAULT_MERGE_SETTINGS.groupStickRespect;
    this.hiddenPlayers = teamSettings.hiddenPlayers || DEFAULT_MERGE_SETTINGS.hiddenPlayers;
    this.canTeamChat = teamSettings.canTeamChat || DEFAULT_MERGE_SETTINGS.canTeamChat;
    this.ephemeral = teamSettings.ephemeral || DEFAULT_MERGE_SETTINGS.ephemeral;

    this.players = [];
    this.queue = [];
  }

  getPlayers(): BasePlayer[] {
    return this.players;
  }

  hasPlayer(player: BasePlayer) {
    return this.players.includes(player);
  }

  unsafeAddPlayer(player: BasePlayer) {
    this.players.push(player);
  }

  unsafeRemovePlayer(player: BasePlayer) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  isInQueue(player: BasePlayer) {
    return this.queue.includes(player);
  }

  unsafeAddToQueue(player: BasePlayer) {
    this.queue.push(player);
  }

  unsafeRemoveFromQueue(player: BasePlayer) {
    let index = this.queue.indexOf(player);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }

  // partials might be cool, but i don't think they're worth it.
  // they would function as so:
  /*
  {
    data: {
      name: this.name,
      color: this.color,
      joinSetting: this.joinSetting
    },
    partial: [
      {
        users: (player) => {
          reutnr player.isHost(); or some shit
        },
        data: {
          balanceType: this.balanceType,
          balanceWeight: this.balanceWeight,
          requiredPlayersType: ... etc
        }
      }
    ]
  }
  */

  toJSON() {
    return {
      name: this.name,
      color: this.color,

      joinSetting: this.joinSetting,
      balanceType: this.balanceType,
      balanceWeight: this.balanceWeight,
      requiredPlayersType: this.requiredPlayersType,
      requiredPlayersWeight: this.requiredPlayersWeight,
      maxPlayersType: this.maxPlayersType,
      maxPlayersWeight: this.maxPlayersWeight,
      playerAbductionSetting: this.playerAbductionSetting,
      pickOrder: this.pickOrder,
      groupStickRespect: this.groupStickRespect,
      hiddenPlayers: this.hiddenPlayers,
      canTeamChat: this.canTeamChat,
      ephemeral: this.ephemeral,

      // old one didn't send balance percentage - only send client relevant data
      // i guess the host does need to know it though

      players: this.hiddenPlayers ? undefined : this.players.length,
      queue: this.hiddenPlayers ? undefined : this.queue.length
    }
  }
}