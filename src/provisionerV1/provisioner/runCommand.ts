import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

export async function runCommand(
  command: string,
  logStreamPath: string
): Promise<void> {
  return new Promise(async (resolve) => {
    const dirLocation = path.dirname(logStreamPath);
    mkdirp.sync(dirLocation);
    fs.writeFileSync(logStreamPath, "");

    const process = spawn("bash", ["-c", command]);
    console.log(`Streaming command ${command} to ${logStreamPath}`);

    process.on("data", (data) => {
      const buffer = data.toString();
      console.log("process.on", buffer);
    });

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

    process.on("close", () => {
      fs.writeFileSync(logStreamPath + ".complete", Date.now().toString());
    });

    resolve();
  });
}
