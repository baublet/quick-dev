import { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import { logServer } from "./logServer";
import { commandRunner } from "./commandRunner";
import { admin } from "./admin";
import { log } from "./log";
import { config } from "./config";

const express = require("express");
const app: Application = express();
const port = 8333;
const secret = config.getSecret();

log("Starting provisioner", {
  secret: config.getSecret(),
  strapYardUrl: config.getSecret(),
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
admin(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
