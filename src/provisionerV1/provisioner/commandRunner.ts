import path from "path";
import fs from "fs";
import { Application } from "express";
import bodyParser from "body-parser";

import { verifySecret } from "./index";
import { LOG_PATH } from "./logServer";
import { runCommand } from "./runCommand";
import { log } from "./log";

export function commandRunner(app: Application) {
  app.get(
    "/command/:commandId",
    bodyParser.text(),
    verifySecret,
    async (req, res) => {
      const commandId = req.params.commandId;

      if (!commandId) {
        return res.sendStatus(400);
      }

      log(`Command server received command: `, req.body);

      const filePath = path.resolve(LOG_PATH, `${commandId}.log`);
      const started = fs.existsSync(filePath);
      const completePath = path.resolve(LOG_PATH, `${commandId}.complete`);
      const isComplete = fs.existsSync(completePath);
      const exitCode: number | undefined = isComplete
        ? parseInt(fs.readFileSync(completePath).toString(), 10)
        : undefined;

      res.json({
        started,
        isComplete,
        exitCode,
      });
    }
  );

  app.post(
    "/command/:commandId",
    bodyParser.text(),
    verifySecret,
    async (req, res) => {
      const commandId = req.params.commandId;
      const command = req.body || "";

      if (!commandId) {
        return res.sendStatus(400);
      }

      console.log(`Command server received command: `, req.body);

      const logFile = path.resolve(LOG_PATH, `${commandId}.log`);
      // Only waits until the command _starts_ running to resolve
      await runCommand(commandId, command, logFile);

      res.sendStatus(200);
    }
  );
}
