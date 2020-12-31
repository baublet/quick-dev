import path from "path";
import { Application } from "express";

import { verifySecret } from "./index";
import { LOG_PATH } from "./logServer"
import { runCommand } from "./runCommand";

export function commandRunner(app: Application) {
  app.post("/command/:commandId", verifySecret, async (req, res) => {
    const commandId = req.params.commandId;
    const body = req.body || "";

    if (!commandId) {
      return res.send(400);
    }

    const logFile = path.resolve(LOG_PATH, `{commandId}.log`);
    await runCommand(body, logFile);

    return res.send(200);
  });
}
