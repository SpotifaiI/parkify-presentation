import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setInterval(async () => {
  try {
    const response = await axios.get("http://parkify_process:3000/sense");
    const senses = response.data.senses;

    if (senses && senses.length > 0) {
      console.log("Dados recebidos do backend:", senses);
      io.emit("refresh", { ok: true, senses });
      console.log("Dados atualizados enviados via WebSocket");
    } else {
      console.log("Nenhum dado encontrado ou lista vazia.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro na requisição HTTP para o backend:", error.message);
    } else {
      console.error("Erro desconhecido:", error);
    }
  }
}, 10000);

server.on("request", (req, res) => {
  if (req.url === "/refresh" && req.method === "GET") {
    console.log("Rota /refresh chamada");

    io.emit("refresh", { ok: true, message: "Dados atualizados!" });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ ok: true, message: "Evento de refresh emitido!" })
    );
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Rota não encontrada");
  }
});

io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

  socket.on("test-connection", () => {
    socket.emit("test-connection", { ok: true });
  });
});

export { server };
