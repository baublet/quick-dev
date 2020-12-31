import { Application, Request, Response, NextFunction } from "express";

const express = require("express");
const app: Application = express();
const port = 8333;

const secret = process.env.SECRET;

const LOG_FILES = {
  cloud: "/var/log/cloud-init-output.log",
};

function verifySecret(req: Request, res: Response, next: NextFunction) {
  if (req.query.secret === secret) {
    return next();
  }
  if (req.headers.authorization === secret) {
    return next();
  }
  res.send(403);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/startupLogs", verifySecret, (req, res) => {
  res.sendFile(LOG_FILES.cloud);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
