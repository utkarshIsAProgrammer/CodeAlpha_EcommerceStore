import { Redis } from "@upstash/redis";
import "dotenv/config";

export const redis = Redis.fromEnv();
