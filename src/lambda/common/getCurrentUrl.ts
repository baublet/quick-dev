import { resolve } from "path";
import { readFile, existsSync } from "fs";

import { log } from "../../common/logger";

const STRAPYARD_URL = process.env.STRAPYARD_URL;
const STRAPYARD_PUBLIC_URL = process.env.STRAPYARD_PUBLIC_URL;
const NGROK_PATH = resolve(process.cwd(), ".ngrokDomain");

export function waitForNgrok() {
  return new Promise<void>((resolve) => {
    const interval = setInterval(async () => {
      if (process.env.STRAPYARD_PUBLIC_URL === "ngrok") {
        if (existsSync(NGROK_PATH)) {
          clearInterval(interval);
          resolve();
          return;
        }
      } else {
        resolve();
      }
    }, 1000);
  });
}

export function getCurrentUrl(
  which: "public" | "internal" = "public"
): Promise<string> {
  return new Promise((resolve, reject) => {
    let url = which === "public" ? STRAPYARD_PUBLIC_URL : STRAPYARD_URL;
    // Here, for development environments, we want to grab the ngrok url
    // from the root directory
    if (url === "ngrok") {
      if (!existsSync(NGROK_PATH)) {
        log.error("ngrok domain file not found. Path checked: ", NGROK_PATH);
        process.exit(1);
      }
      readFile(NGROK_PATH, (_err, data) => {
        resolve(data.toString());
      });
      return;
    }
    if (!url) {
      reject(
        "getCurrentUrl invariance error! Could not resolve a URL for the current environment. Either use NGROK or set proper environment variables. Exiting the application"
      );
      process.exit(1);
    }
    resolve(url);
  });
}
