import express, { Express } from "express";
import { Client } from "pg";
import { createClient } from "redis";
import pino from "pino";

const logger = pino();
const redis = createClient({ url: process.env.REDIS_HOST });
const client = new Client({
  host: process.env.PG_HOST,
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "root",
});

async function main() {
  await client.connect();
  await redis.connect();

  const PORT = parseInt(process.env.PORT || "5000");
  const app: Express = express();

  app.get("/v1/test", async (_, res) => {
    logger.info("querying postgres");
    await client.query("SELECT NOW()");
    res.status(200).json({ hello: "v1" });
  });

  app.get("/v2/test", async (_, res) => {
    logger.info("caching value");
    await redis.set("key", "value");
    res.status(200).json({ hello: "v2" });
  });

  app.listen(PORT, () => {
    logger.info(`Listening for requests on http://localhost:${PORT}`);
  });
}

main();
