import Redis from "ioredis";
import { config } from "@src/configs/AppConfig";

const redis = new Redis({
  host: config.REDIS_HOST,
  port: Number.parseInt(config.REDIS_PORT),
});

redis.on("connect", () => console.log("🔗 Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
