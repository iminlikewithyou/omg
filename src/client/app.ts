import { Application, Container } from "pixi.js";
import { GameCode } from "@shared/games/directory/GameDirectory";
import { Player } from "./objects/Player";
import { Room } from "./objects/Room";
import { PlayerContainer } from "./objects/PlayerContainer";
import Socket from "./network/Socket";
//import anime from 'animejs';

//-----------------------------------------------------------
// Application

const app = new Application({
  // autoResize: true,
  resolution: devicePixelRatio,
  autoDensity: true
});
document.body.appendChild(app.view);

//-----------------------------------------------------------
// Utility

function connectResizeFunction(fx) {
  window.addEventListener('resize', fx);
  fx();
}

function removeResizeFunction(fx) {
  window.removeEventListener('resize', fx);
}

//-----------------------------------------------------------
// Game

let gameContainer = new Container();
app.stage.addChild(gameContainer);

//-----------------------------------------------------------
// Resize stuffs

// Listen for window resize events
connectResizeFunction(() => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

//-----------------------------------------------------------
// Connections

let myPlayer: Player;

Socket.on('connected', (player: Player, server: String) => {
  console.log(`Connected to Boba!\nYou're in the ${server} server.\n${player.username ?? "Lame Guest"} - ID: ${player.ID}`);
  myPlayer = player;
});

//-----------------------------------------------------------
// Lobby stuff

let connectedRooms: Room[] = [];

// Handle if the player completely disconnects from the server

type LobbyInfo = {
  ID: string;
  playerContainer: any;
  gameCode?: string;
}

Socket.on('lobby:connect', (lobbyInfo: LobbyInfo) => {
  let room = new Room(lobbyInfo.ID, new PlayerContainer(lobbyInfo.playerContainer.playerInfo, lobbyInfo.playerContainer.teams), <GameCode> lobbyInfo.gameCode);

  console.log("Connected to room " + room.ID + "!\nPlayers in room:");
  for (let player of room.playerContainer.players) console.log(player.ID + " - " + (player.username ?? "Lame Guest"));

  Socket.on(`${room.ID}:join`, (player: Player) => {
    room.addPlayer(player);
  });

  Socket.on(`${room.ID}:leave`, (player: Player) => {
    if (player.ID == myPlayer.ID) {
      connectedRooms.splice(connectedRooms.indexOf(room), 1);
      room.cleanup();
      Socket.off(`${room.ID}:start`);
      Socket.off(`${room.ID}:end`);
      Socket.off(`${room.ID}:join`);
      Socket.off(`${room.ID}:leave`);
      return;
    }
    room.removePlayer(player);
  });

  Socket.on(`${room.ID}:start`, () => {
    room.startGame();
  });

  Socket.on(`${room.ID}:end`, () => {
    room.endGame();
  });

  connectedRooms.push(room);
});

// socket.on('joinedRoom', (ID: string, player: Player) => {
//   let room = connectedRooms.find((room) => room.ID == ID);
//   if (room) room.addPlayer(player);
// });

// socket.on('leaveRoom', (ID: string, player: Player) => {
//   let room = connectedRooms.find((room) => room.ID == ID);
//   if (!room) return;

//   if (player.ID == myPlayer.ID) {
//     connectedRooms.splice(connectedRooms.indexOf(room), 1);
//     room.cleanup();
//     return;
//   }
//   room.removePlayer(player);
// });

// socket.on('initGame', (ID: string) => {
//   let room = connectedRooms.find((room) => room.ID == ID);
//   if (room) room.startGame();
// });

// socket.on('endGame', (ID: string) => {
//   let room = connectedRooms.find((room) => room.ID == ID);
//   if (room) room.endGame();
// });

export {
  app,
  connectResizeFunction,
  removeResizeFunction
}