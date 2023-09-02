import axios from "axios";
import express, { Express } from "express";
import { createClient } from "redis";
import pino from "pino";

const PORT = parseInt(process.env.PORT || "5000");
const app: Express = express();
const logger = pino();
const redis = createClient({ url: process.env.REDIS_HOST });

app.get("/rolldice", async (req, res) => {
  await redis.connect();
  await redis.set("nodejs1", "yes");

  await Promise.all([
    axios.get(`${process.env.UPSTREAM_ENDPOINT}/v1/test`),
    axios.get(`${process.env.UPSTREAM_ENDPOINT}/v2/test`),
  ]);
  logger.info("rolling dice");

  await redis.disconnect();
  res.status(200).json({ hello: "world" });
});

app.listen(PORT, () => {
  logger.info(`Listening for requests on http://localhost:${PORT}`);
});
