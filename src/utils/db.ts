import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

const { REDIS_URL } = process.env;
if (!REDIS_URL) throw new Error("REDIS_URL is not set");

export const redis = new Redis(REDIS_URL);

export const prisma = new PrismaClient();
