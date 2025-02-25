import { Server } from "socket.io";

export const io = new Server({
  cors: { origin: "*" },
  maxHttpBufferSize: 1e8,
});
