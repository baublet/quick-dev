import { resolve } from "path";
import { readFile, existsSync } from "fs";

import { log } from "../../common/logger";

const STRAPYARD_URL = process.env.STRAPYARD_URL;
const STRAPYARD_PUBLIC_URL = process.env.STRAPYARD_PUBLIC_URL;
const NGROK_PATH = resolve(process.cwd(), ".ngrokDomain");

export function getCurrentUrl(
  which: "public" | "internal" = "public"
): Promise<string> {
  return new Promise((resolve) => {
    let url = which === "public" ? STRAPYARD_PUBLIC_URL : STRAPYARD_URL;
    // Here, for development environments, we want to grab the ngrok url
    // from the root directory
    if (url === "ngrok") {
      if (!existsSync(NGROK_PATH)) {
        log.error("ngrok domain file not found. Path checked: ", NGROK_PATH);
        process.exit(1);
      }
      readFile(NGROK_PATH, (err, data) => {
        resolve(data.toString());
      });
      return;
    }
    resolve(url);
  });
}
