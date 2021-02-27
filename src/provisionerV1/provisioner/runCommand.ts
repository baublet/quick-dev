import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import execa from "execa";

import { log } from "./log";
import { reportComplete } from "./reportComplete";

export async function runCommand(
  commandId: string,
  command: string,
  logStreamPath: string
): Promise<void> {
  return new Promise(async (resolve) => {
    log("Running command", { command });
    const dirLocation = path.dirname(logStreamPath);
    mkdirp.sync(dirLocation);
    fs.writeFileSync(logStreamPath, "");

    let processExitCode: number = 0;

    try {
      const subprocess = execa("bash", ["-c", command], { all: true });
      subprocess.all?.pipe(fs.createWriteStream(logStreamPath));
      await subprocess;
      log(`Command executed successfully`);
    } catch (error) {
      const execaError: execa.ExecaError = error;
      processExitCode = execaError.exitCode;
      log(`Error running command: ${execaError.message}`, error);
    }

    await reportComplete(
      commandId,
      logStreamPath,
      processExitCode === null ? 0 : processExitCode
    );

    resolve();
  });
}
