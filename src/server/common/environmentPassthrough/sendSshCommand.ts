import { Client } from "ssh2";

import { log } from "../../../common/logger";
import { getDatabaseConnection } from "../../common/db";
import { environmentCommandLog } from "../entities";

export function sendSshCommand({
  ipv4,
  privateKey,
  command,
  // 15 minute timeout by default
  timeoutInMs = 1000 * 60 * 15,
  workingDirectory,
  environmentId,
  environmentCommandId,
}: {
  ipv4: string;
  privateKey: string;
  command: string;
  timeoutInMs?: number;
  workingDirectory: string;
  environmentId?: string;
  environmentCommandId?: string;
}): Promise<{
  error: string | false;
  code?: number;
  signal?: string;
  totalMs: number;
}> {
  const startTime = Date.now();
  const db = getDatabaseConnection();
  return new Promise(async (resolve) => {
    const connection = new Client();

    let buffer = "";

    connection.on("ready", () => {
      log.debug("SSH client ready", {
        ipv4,
        commandFirst50: command.substring(0, 50),
      });

      const writeBuffer = async () => {
        try {
          if (!environmentCommandId || !environmentId) {
            return;
          }
          if (buffer.length === 0) {
            return;
          }
          const toWrite = buffer;
          buffer = "";
          await environmentCommandLog.create(db, {
            environmentCommandId,
            environmentId,
            logOutput: toWrite,
          });
        } catch (e) {}
      };

      const bufferWriter = setInterval(async () => {
        await writeBuffer();
      }, 1000);

      const timeout = setTimeout(() => {
        connection.end();
        resolve({
          error: `Command timed out after ${timeoutInMs / 1000}s`,
          totalMs: Date.now() - startTime,
        });
      }, timeoutInMs);

      const cancelTimers = async () => {
        await writeBuffer();
        clearTimeout(timeout);
        clearInterval(bufferWriter);
      };

      connection.exec(
        `cd ${workingDirectory}; ${command}`,
        { pty: true },
        async (err, stream) => {
          if (err) {
            await cancelTimers();
            return resolve({
              error: err.message + "\n\n" + err.stack,
              totalMs: Date.now() - startTime,
            });
          }
          stream
            .on("close", async (code: number, signal: string) => {
              connection.end();
              await cancelTimers();
              resolve({
                error: false,
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
