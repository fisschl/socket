import { Hono } from "hono";
import { v7 as uuid } from "uuid";
import { z } from "zod";
import { prisma } from "../utils/db";
import { zValidator } from "@hono/zod-validator";

const visitRequestSchema = z.object({
  full_path: z.string(),
  ua: z.string(),
});

export const api = new Hono()
  .post("/uuid", (ctx) => {
    const item = uuid();
    return ctx.json({ uuid: item });
  })
  .post("/visit", zValidator("json", visitRequestSchema), async (ctx) => {
    const body = ctx.req.valid("json");
    await prisma.visit_logs.create({
      data: body,
    });
    return ctx.json({ message: "ok" });
  });
