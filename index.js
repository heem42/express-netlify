import express, { Router } from "express";
import { connectAndSetupDB, pool } from "./database";

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  const client = await pool.connect();
  req.dbClient = client;
  res.on('finish', () => {
    client.release(); 
  });
  next();
});

connectAndSetupDB();

const router = Router();

export { router, app };
