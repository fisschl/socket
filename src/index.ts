import { Hono } from "hono";
import { cors } from "hono/cors";
import { api } from "./api";
import { io } from "./socket";

io.listen(4000);
console.log("Socket.IO server is running on port 4000");

const app = new Hono();

app
  .use("/api/*", cors())
  .get("/", (ctx) => {
    return ctx.text("Hello World!");
  })
  .route("/api", api);

export default app;
