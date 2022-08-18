import { GameCode } from "./GameDirectory";
import { Player } from "./objects/Player";
import { Room } from "./objects/Room";

import express = require("express");
import http = require('http');
import { Server } from 'socket.io';

import path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
export default io;

app.use(express.static(path.join(__dirname, "../../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/dist', 'index.html'));
});

const PORT = 8080;

let connectedPlayers = [];

let defaultRoom = new Room(GameCode.DUMMY_GAME);

io.on('connection', (socket) => {
  let player = new Player(socket);
  connectedPlayers.push(player);

  console.log('Player connected to Boba server - ' + connectedPlayers.length + ' online.');
  
  socket.emit('connected', player);
  defaultRoom.addPlayer(player);
  
  socket.on('disconnect', () => {
    connectedPlayers.splice(connectedPlayers.indexOf(player), 1);

    defaultRoom.removePlayer(player);

    console.log("Player disconnected from Boba server - " + connectedPlayers.length + ' online.');
  });
});

server.listen(PORT, () => {
  console.log("💝 Boba server active!");
});