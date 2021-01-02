import path from "path";
import { Application } from "express";
import fs from "fs";
import { sync as mkdirp } from "mkdirp";

import { verifySecret } from "./index";
import { readBytesAfterN } from "./readBytesAfterN";

export const LOG_PATH = path.resolve("/var/log/strapyard/");
mkdirp(LOG_PATH);

export function logServer(app: Application) {
  const LOG_FILES = {
    cloud: "/var/log/cloud-init-output.log",
  };

  app.get("/startupLogs", verifySecret, (req, res) => {
    res.sendFile(LOG_FILES.cloud);
  });

  app.get("/logs/:commandId", verifySecret, async (req, res) => {
    const logFile = path.resolve(
      LOG_PATH,
      (req.params.commandId.replace(/\./g, "") || "notHere") + ".log"
    );
    if (!fs.existsSync(logFile)) {
      res.send(404);
      return;
    }
    const after = parseInt(`${req.query.after}`, 10) || 0;
    const chunk = await readBytesAfterN(logFile, after);
    res.send(chunk);
  });
}
