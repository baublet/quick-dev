import { Client } from "ssh2";

import { log } from "../../../common/logger";

export function sendSshCommand({
  ipv4,
  privateKey,
  command,
  timeoutInMs = 1000 * 60 * 5,
}: {
  ipv4: string;
  privateKey: string;
  command: string;
  timeoutInMs?: number;
}): Promise<{
  error: string | false;
  buffer?: string;
  errorBuffer?: string;
  code?: number;
  signal?: string;
}> {
  return new Promise(async (resolve) => {
    const connection = new Client();

    let buffer = "";
    let errorBuffer = "";

    connection.on("ready", function () {
      log.debug("SSH client ready", {
        ipv4,
        commandFirst50: command.substring(0, 50),
      });

      const timeout = setTimeout(() => {
        connection.end();
        resolve({
          error: `Command timed out after ${timeoutInMs / 1000}s`,
          buffer,
          errorBuffer,
        });
      }, timeoutInMs);
      const cancelTimeout = () => clearTimeout(timeout);

      connection.exec(command, async (err, stream) => {
        if (err) {
          cancelTimeout();
          return resolve({
            error: err.message + "\n\n" + err.stack,
          });
        }
        stream
          .on("close", async (code: number, signal: string) => {
            connection.end();
            cancelTimeout();
            resolve({ error: false, buffer, errorBuffer, code, signal });
          })
          .on("data", (data: string) => {
            buffer = buffer + data;
          })
          .stderr.on("data", (data: string) => {
            buffer = buffer + data;
            errorBuffer = errorBuffer + data;
          });
      });
    });

    connection.connect({
      host: ipv4,
      username: "root",
      privateKey,
    });
  });
}
