import { Server } from "socket.io";

export const io = new Server({
  cors: { origin: "*" },
  /**
   * 100MB
   */
  maxHttpBufferSize: 1e8,
});
