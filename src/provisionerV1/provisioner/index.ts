import { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import { logServer } from "./logServer";
import { commandRunner } from "./commandRunner";
import { log } from "./log";

const express = require("express");
const app: Application = express();
const port = 8333;
const secret = process.env.SECRET;

log("Starting provisioner", {
  secret: process.env.SECRET,
  strapyardUrl: process.env.STRAPYARD_URL,
});

app.use(bodyParser.urlencoded({ extended: true }));

export function verifySecret(req: Request, res: Response, next: NextFunction) {
  if (req.query.secret === secret) {
    return next();
  }
  if (req.headers.authorization === secret) {
    return next();
  }
  res.send(403);
}

app.get("/", (req, res) => {
  res.send("Provision server up and running");
});

logServer(app);
commandRunner(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
