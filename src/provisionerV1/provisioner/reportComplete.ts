import fs from "fs";
import fetch from "node-fetch";

import { log } from "./log";

export async function reportComplete(
  commandId: string,
  logStreamPath: string,
  exitCode: number
): Promise<void> {
  const secret = process.env.SECRET;
  const strapYardUrl = process.env.STRAPYARD_URL;
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
  } catch (e) {
    const data = `Error reporting a command completion... ${e.message} ${e.stack}`;
    log(data);
  }
  fs.writeFileSync(logStreamPath + ".complete", Date.now().toString());
}
