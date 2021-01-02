import fs from "fs";
import fetch from "node-fetch";

import type { EnvironmentCommand } from "../../lambda/common/environmentCommand";

const secret = process.env.SECRET;
const strapYardUrl = process.env.STRAPYARD_URL;

export async function reportComplete(
  commandId: string,
  logStreamPath: string,
  exitCode: number
): Promise<void> {
  try {
    const status = exitCode === 0 ? "success" : "failure";
    const response = await fetch(
      `${strapYardUrl}/.netlify/functions/environmentCommandComplete?commandId=${commandId}&status=${status}`,
      {
        method: "post",
        headers: {
          authorization: secret,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Expect status to be 200! It was " + response.status);
    }
  } catch (e) {
    const data = `Error reporting a command completion... ${e.message} ${e.stack}`;
    fs.appendFileSync(process.cwd() + "/error.log", data);
    fs.writeFileSync(logStreamPath + ".complete", "");
  }
}
