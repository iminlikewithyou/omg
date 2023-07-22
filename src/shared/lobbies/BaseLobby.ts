import { randomUUID } from "crypto";
import { BasePlayer } from "./BasePlayer";
import { BasePlayerContainer } from "./BasePlayerContainer";

export enum LobbyAddResult {
  OK,
  ALREADY_IN_LOBBY,
  LOBBY_FULL
}

export enum LobbyRemoveResult {
  OK,
  NOT_IN_LOBBY
}

export abstract class BaseLobby {
  public ID: string;

  public playerContainer: BasePlayerContainer;
  public maxPlayers: number = 10;

  constructor(ID = randomUUID()) {
    this.ID = ID;
  }

  // getLobbyInfo() {
  //   return {
  //     ID: this.ID,
  //     playerContainer: this.playerContainer
  //   }
  // }

  addPlayer(player: BasePlayer): LobbyAddResult {
    // Check if the player is already in the lobby
    if (this.playerContainer.hasPlayer(player)) return LobbyAddResult.ALREADY_IN_LOBBY;
    
    // Add the player to the lobby
    this.playerContainer.addPlayer(player);
    // force player on team on the extending class after calling super() on THIS method.

    // Add the player to the EntityData
    // if the game is about to start - force them on a team - otherwise don't

    // Tell all players in the lobby that a player has joined
    // player.socket.join(this.ID);
    // player.socket.emit('lobby:connect', this.getLobbyInfo());
    // player.socket.to(this.ID).emit(`${this.ID}:join`, player);

    // Emit to this object that a player has joined
    // this.emit('join', player);
    console.log("Player joined lobby " + this.ID + " - " + this.playerContainer.length + " in lobby"); // make a getter for length

    // get an onPlayerJoin method by extending an Emitter and have BaseGameHandler listen for it
    
    // This will go in game handlers
    // if (this.inProgress) {
    //   player.socket.emit(`${this.ID}:init`);
    //   if (this.game.playerJoined) {
    //     let data = this.game.playerJoined(player);
    //     this.startPlayer(player, data);
    //   }
    // }

    return LobbyAddResult.OK;
  }
}