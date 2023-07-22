import { Socket } from "socket.io";
import { BasePlayer } from "@shared/lobbies/BasePlayer";

// let currentPlayerID = 1;

export class Player extends BasePlayer {
  socket: Socket;

  constructor(ID: number, name: string, color: number, socket: Socket) {
    super(ID, name, color);

    this.socket = socket;

    // this.ID = currentPlayerID;
    // this.name = "Lame Guest";
    // this.socket = socket;

    // use HSV instead so that it doesn't generate
    // shitty colors
    // this.color = Math.random() * 0xffffff;

    // currentPlayerID++;
  }

  getPlayers(): Player[] {
    return [this];
  }
}