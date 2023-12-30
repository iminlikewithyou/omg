import { Application, Container } from "pixi.js";
// import { GameCode } from "@shared/games/directory/GameDirectory";
import { Room } from "./objects/Room";
// import { PlayerContainer } from "./objects/PlayerContainer";
import Boba from "./network/Boba";
import { BasePlayer } from "./lobbies/BasePlayer";
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

let myPlayer: BasePlayer;

Boba.on('connected', (player: BasePlayer, server: String) => {
  console.log(`Connected to Boba!\nYou're in the ${server} server.\n${player.name ?? "Lame Guest"} - ID: ${player.ID}`);
  myPlayer = player;
});

//-----------------------------------------------------------
// Lobby stuff

let connectedRooms: Room[] = [];

// Handle if the player completely disconnects from the server

// type LobbyInfo = {
//   ID: string;
//   playerContainer: any;
//   gameCode?: string;
// }

// Boba.on('lobby:connect', (lobbyInfo: LobbyInfo) => {
//   let room = new Room(lobbyInfo.ID, new PlayerContainer(lobbyInfo.playerContainer.playerInfo, lobbyInfo.playerContainer.teams), <GameCode> lobbyInfo.gameCode);

//   console.log("Connected to room " + room.ID + "!\nPlayers in room:");
//   for (let player of room.playerContainer.players) console.log(player.ID + " - " + (player.username ?? "Lame Guest"));

//   Boba.on(`${room.ID}:join`, (player: Player) => {
//     room.addPlayer(player);
//   });

//   Boba.on(`${room.ID}:leave`, (player: Player) => {
//     if (player.ID == myPlayer.ID) {
//       connectedRooms.splice(connectedRooms.indexOf(room), 1);
//       room.cleanup();
//       Boba.off(`${room.ID}:start`);
//       Boba.off(`${room.ID}:end`);
//       Boba.off(`${room.ID}:join`);
//       Boba.off(`${room.ID}:leave`);
//       return;
//     }
//     room.removePlayer(player);
//   });

//   Boba.on(`${room.ID}:start`, () => {
//     room.startGame();
//   });

//   Boba.on(`${room.ID}:end`, () => {
//     room.endGame();
//   });

//   connectedRooms.push(room);
// });

// Boba.on("lobby:join", (player: Player) => {
//   console.log("Player " + player.ID + " joined the lobby.");
// })

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