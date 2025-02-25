import { Hono } from "hono";
import { cors } from "hono/cors";
import { api } from "./api";
const app = new Hono();

app
  .use("/api/*", cors())
  .get("/", (ctx) => {
    return ctx.text("Hello World!");
  })
  .route("/api", api);

export default app;
