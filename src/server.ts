import { server } from "./app";

server.listen(8000, "127.0.0.1", () => {
  console.log("Servidor WebSocket rodando em http://localhost:8000");
});
