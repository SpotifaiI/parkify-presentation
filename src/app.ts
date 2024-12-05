import cors from 'cors';
import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(cors());
app.use(json());

type RefreshData = {
  recentFilledSlot: string;
  recentFreeSlot: string;
  busySlot: string;
  chillSlot: string;
  timeFreeToday: string;
  timeFilledToday: string;
  recentFree: string[];
  recentFilled: string[];
};

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.get('/', (_, res) => {
  res.status(200).send({ ok: true });
});

app.post('/refresh', (req, res) => {
  const data: RefreshData = req.body;

  console.log('repassando dados...', data);

  io.emit('refresh', data);
  res.status(200).send(data);
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
