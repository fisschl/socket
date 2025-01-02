import "@std/dotenv/load";
import { Server } from "socket.io";
import { handleTranslate } from "./router/translate.ts";
import { handleVariables } from "./router/variables.ts";

const io = new Server({
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  handleTranslate(io, socket);
  handleVariables(io, socket);
});

io.listen(4000);
