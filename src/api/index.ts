import { Hono } from "hono";
import { v7 as uuid } from "uuid";
import { z } from "zod";
import { prisma } from "../utils/db";

const VisitRequestSchema = z.object({
  full_path: z.string(),
  ua: z.string(),
});

export const api = new Hono()
  .post("/uuid", (ctx) => {
    const item = uuid();
    return ctx.json({ uuid: item });
  })
  .post("/visit", async (ctx) => {
    const body = await ctx.req.json();
    const visit = VisitRequestSchema.parse(body);
    await prisma.visit_logs.create({
      data: visit,
    });
    return ctx.json({ message: "ok" });
  });
