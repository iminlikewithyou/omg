import { Player } from "./games/classes/entities/Player";
import { DedicatedGameHandler } from "./games/classes/gamehandlers/DedicatedGameHandler";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

export default io;


app.use(express.static(path.join(__dirname, "../../public")));
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, '../../public/dist', 'index.html'));
});

const PORT = 8080;
const SERVER_NAME = "Minty"; // Vanilla

let connectedPlayers = [];

let defaultRoom = new DedicatedGameHandler("DummyGame");
let currentPlayerID = 1;

io.on('connection', (socket) => {
  let player = new Player(currentPlayerID++, "Lame Guest", Math.random() * 0xffffff, socket);
  connectedPlayers.push(player);

  console.log('Player connected to Boba server - ' + connectedPlayers.length + ' online.');
  
  console.log(1);
  socket.emit('connected', player, SERVER_NAME);
  console.log(2);
  defaultRoom.addPlayer(player);
  
  socket.on('disconnect', () => {
    connectedPlayers.splice(connectedPlayers.indexOf(player), 1);

    defaultRoom.removePlayer(player);

    console.log("Player disconnected from Boba server - " + connectedPlayers.length + ' online.');
  });

  console.log(3);
});

server.listen(PORT, () => {
  console.log("💝 Boba server active!");
});