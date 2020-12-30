import { Request, Response, NextFunction } from "express";

const app = require("express")();
const port = 8333;

const SETUP_LOGS_PATH = "/var/log/cloud-init-output.log";
const ENVIRONMENT_SECRET = process.env.ENVIRONMENT_SECRET || "secret";

function verifySecret(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.headers.authorization !== ENVIRONMENT_SECRET) {
    return response.send(403);
  }
  next();
}

app.get("/", (req, res) => {
  res.send("Provision server running");
});

app.get("/setupLogs", verifySecret, (req, res) => {
  res.sendFile(SETUP_LOGS_PATH);
});

app.listen(port, () => {
  console.log(`Provision server listening at port ${port}`);
});
