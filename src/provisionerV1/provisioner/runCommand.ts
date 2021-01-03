import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

import { reportComplete } from "./reportComplete";

export async function runCommand(
  commandId: string,
  command: string,
  logStreamPath: string
): Promise<void> {
  return new Promise(async (resolve) => {
    const dirLocation = path.dirname(logStreamPath);
    mkdirp.sync(dirLocation);
    fs.writeFileSync(logStreamPath, "");

    const process = spawn("bash", ["-c", command]);
    console.log(`Streaming command ${command} to ${logStreamPath}`);

    process.stdout.on("data", (data) => {
      const buffer = data.toString();
      console.log("process.stdout.on", buffer);
      fs.appendFileSync(logStreamPath, buffer);
    });

    process.stderr.on("data", (data) => {
      const buffer = data.toString();
      console.log("process.stderr.on", buffer);
      fs.appendFileSync(logStreamPath, buffer);
    });

    process.on("error", (error) => {
      console.log(`error: ${error.message}`);
    });

    process.on("exit", (code) => {
      reportComplete(commandId, logStreamPath, code);
    });

    resolve();
  });
}
