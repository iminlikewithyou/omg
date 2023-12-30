export enum GroupStickRespect {
  IGNORE_GROUP_STICK,
  RESPECT_GROUP_STICK
}

export enum PickOrder {
  RANDOM,
  LATEST_PLAYERS // this means that the latest players to join teams will be the first to be picked randomly
}

export enum PlayerAbductionSetting {
  ANY_PLAYER,
  NON_TEAMED,
}

export enum TeamJoinSetting {
  JOINABLE,
  QUEUEABLE,
  LOCKED
}

export enum WeightType {
  PERCENTAGE,
  WEIGHT
}

// to create a team
export type TeamConfig = {
  name?: string;
  color?: number;

  joinSetting?: TeamJoinSetting;

  balanceType?: WeightType;
  balanceWeight?: number;

  requiredPlayersType?: WeightType;
  requiredPlayersWeight?: number;

  maxPlayersType?: WeightType;
  maxPlayersWeight?: number;
  
  playerAbductionSetting?: PlayerAbductionSetting;
  pickOrder?: PickOrder;
  groupStickRespect?: GroupStickRespect;
  
  hiddenPlayers?: boolean;
  canTeamChat?: boolean;

  ephemeral?: boolean;
}

// once a team is created, it is converted to this
export type TeamSettings = Required<TeamConfig>;

export const DEFAULT_TEAM_SETTINGS: TeamSettings = {
  name: "Players",
  color: 0x2afa23,

  joinSetting: TeamJoinSetting.JOINABLE,

  balanceType: WeightType.WEIGHT,
  balanceWeight: 1,

  requiredPlayersType: WeightType.WEIGHT,
  requiredPlayersWeight: 0,

  maxPlayersType: WeightType.PERCENTAGE,
  maxPlayersWeight: 1,

  playerAbductionSetting: PlayerAbductionSetting.NON_TEAMED,
  pickOrder: PickOrder.LATEST_PLAYERS,
  groupStickRespect: GroupStickRespect.RESPECT_GROUP_STICK,

  hiddenPlayers: false,
  canTeamChat: true,

  ephemeral: false
}