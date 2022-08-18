import { Application, Container } from 'pixi.js';
import { GameCode } from './GameDirectory';
import { Player } from './objects/Player';
import { Room } from './objects/Room';
import socket from './utils/socket';
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

let myPlayer = null;

socket.on('connected', (player: Player) => {
  myPlayer = player;
});

//-----------------------------------------------------------
// Lobby stuff

let connectedRooms: [Room?] = [];

// Handle if the player completely disconnects from the server

socket.on('connectToRoom', (ID: string, players: [Player], gameCode: GameCode) => {
  console.log("Connected to room " + ID + "!\nPlayers in room:");
  for (let player of players) console.log(player.ID + " - " + player.username);

  connectedRooms.push(new Room(ID, players, gameCode));
});

socket.on('joinedRoom', (ID: string, player: Player) => {
  connectedRooms.find((room) => room.ID == ID).addPlayer(player);
});

socket.on('leaveRoom', (ID: string, player: Player) => {
  let room = connectedRooms.find((room) => room.ID == ID);
  if (player.ID == myPlayer.ID) {
    connectedRooms.splice(connectedRooms.indexOf(room), 1);
    room.cleanup();
    return;
  }
  room.removePlayer(player);
});

socket.on('initGame', (ID: string) => {
  connectedRooms.find((room) => room.ID == ID).startGame();
});

socket.on('endGame', (ID: string) => {
  connectedRooms.find((room) => room.ID == ID).endGame();
});

export {
  app,
  connectResizeFunction,
  removeResizeFunction
}