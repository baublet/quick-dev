import path from "path";
import { Application } from "express";
import bodyParser from "body-parser";

import { verifySecret } from "./index";
import { LOG_PATH } from "./logServer";
import { runCommand } from "./runCommand";

export function commandRunner(app: Application) {
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
      await runCommand(command, logFile);

      res.sendStatus(200);
    }
  );
}
