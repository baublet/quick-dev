import { Client } from "ssh2";

import { log } from "../../../common/logger";

export function sendSshCommand({
  ipv4,
  privateKey,
  command,
  // 15 minute timeout by default
  timeoutInMs = 1000 * 60 * 15,
  workingDirectory,
}: {
  ipv4: string;
  privateKey: string;
  command: string;
  timeoutInMs?: number;
  workingDirectory: string;
}): Promise<{
  error: string | false;
  buffer?: string;
  errorBuffer?: string;
  code?: number;
  signal?: string;
  totalMs: number;
}> {
  const startTime = Date.now();
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
          totalMs: Date.now() - startTime,
        });
      }, timeoutInMs);
      const cancelTimeout = () => clearTimeout(timeout);

      connection.exec(
        `(([[ -f "~/.bashrc" ]] && source "~/.bashrc"); cd ${workingDirectory}; ${command})`,
        async (err, stream) => {
          if (err) {
            cancelTimeout();
            return resolve({
              error: err.message + "\n\n" + err.stack,
              totalMs: Date.now() - startTime,
            });
          }
          stream
            .on("close", async (code: number, signal: string) => {
              connection.end();
              cancelTimeout();
              resolve({
                error: false,
                buffer,
                errorBuffer,
                code,
                signal,
                totalMs: Date.now() - startTime,
              });
            })
            .on("data", (data: string) => {
              buffer = buffer + data;
            })
            .stderr.on("data", (data: string) => {
              buffer = buffer + data;
              errorBuffer = errorBuffer + data;
            });
        }
      );
    });

    connection.on("error", (message) => {
      log.error("Unexpected error sending an SSH command", {
        environmentIp: ipv4,
        command,
        message,
      });
      resolve({
        error: "Unknown connection error",
        buffer,
        errorBuffer,
        totalMs: Date.now() - startTime,
      });
    });

    connection.connect({
      host: ipv4,
      username: "root",
      privateKey,
    });
  });
}
