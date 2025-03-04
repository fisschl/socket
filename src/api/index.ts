import { Hono } from "hono";
import { v7 as uuid } from "uuid";
import { prisma } from "../utils/db";

export const api = new Hono()
  .post("/uuid", (ctx) => {
    const item = uuid();
    return ctx.json({ uuid: item });
  })
  .post("/visit", async (ctx) => {
    const body = await ctx.req.json();
    await prisma.visit_logs.create({
      data: body,
    });
    return ctx.json({ message: "ok" });
  });
