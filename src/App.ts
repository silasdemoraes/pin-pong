import express, { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { GameEngine } from './GameEngine';

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);


app.use(express.static('public'));

const gameEngine = new GameEngine();
gameEngine.init();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  gameEngine.addPlayer(socket);

  if (gameEngine.canStart()) {
    gameEngine.start();
    io.emit('game-start');
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');

    gameEngine.removePlayer(socket);

    gameEngine.reset();
    io.emit('game-reset');

  });
  
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
