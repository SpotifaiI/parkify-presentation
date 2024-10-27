import cors from 'cors';
import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(cors());
app.use(json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.get('/', (_, res) => {
  res.status(200).send({ ok: true });
});

app.get('/refresh', (_, res) => {
  io.emit('refresh', { ok: true });

  res.status(200).send({ ok: true });
});

io.on('connection', socket => {
  socket.on('connect', () => {
    console.log(`Cliente ${socket.id} entrou!`);
  });

  socket.on('disconnect', () => {
    console.log(`Cliente ${socket.id} saiu!`);
  });

  socket.on('test-connection', () => {
    socket.emit('test-connection', { ok: true });
  });
});

export { server };
