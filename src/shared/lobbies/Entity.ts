import { NetworkObject } from "../network/NetworkObject";
import { BasePlayer } from "./BasePlayer";

// might need a is(Entity) method in Entity
// to test if a Player is part of a Team

export interface Entity extends NetworkObject {
  name: string;
  color: number;

  getPlayers(): BasePlayer[];
}