import fs from "fs";
import fetch from "node-fetch";

import { log } from "./log";
import { config } from "./config";

async function sendCompleteNotification(
  commandId: string,
  logStreamPath: string,
  exitCode: number
): Promise<boolean> {
  const secret = config.getSecret();
  const strapYardUrl = config.getStrapYardUrl();
  try {
    const status = exitCode === 0 ? "success" : "failed";
    const url = `${strapYardUrl}/.netlify/functions/environmentCommandComplete?commandId=${commandId}&status=${status}`;
    log(`Notifying command complete: ${url}`);
    const response = await fetch(url, {
      method: "post",
      headers: {
        authorization: secret || "",
      },
    });
    if (response.status !== 200) {
      throw new Error("Expect status to be 200! It was " + response.status);
    }
    return true;
  } catch (e) {
    log(`Error reporting a command completion... ${e.message} ${e.stack}`);
    return false;
  }
}

export async function reportComplete(
  commandId: string,
  logStreamPath: string,
  exitCode: number
): Promise<void> {
  return new Promise(async (resolve) => {
    // Always write this ASAP. It's the canonical record this machine will
    // use to determine whether to command completed or not.
    fs.writeFileSync(logStreamPath + ".complete", `$${exitCode}`);

    const sent = await sendCompleteNotification(
      commandId,
      logStreamPath,
      exitCode
    );

    if (sent) {
      resolve();
      return;
    }

    const interval = setInterval(async () => {
      const sent = await sendCompleteNotification(
        commandId,
        logStreamPath,
        exitCode
      );
      if (sent) {
        clearInterval(interval);
        resolve();
      }
    }, 3000);
  });
}
