import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

api.use(express.json());

const router = Router();
router.get("/hello", (req, res) => res.send({  }));

api.use("/api/", router);

export const handler = serverless(api);


/*

import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello"));

api.use("/api/", router);

export const handler = serverless(api);
*/