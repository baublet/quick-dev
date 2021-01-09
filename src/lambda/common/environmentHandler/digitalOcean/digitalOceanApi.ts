import { fetch } from "../../fetch";
import { log } from "../../../../common/logger";

export async function digitalOceanApi<T = any>({
  body,
  path,
  method = "post",
  expectStatus,
}: {
  path: string;
  method?: "post" | "delete" | "get";
  body?: Record<string, any>;
  expectStatus: number;
}): Promise<T> {
  if (!process.env.DIGITAL_OCEAN_TOKEN) {
    throw new Error("No DIGITAL_OCEAN_TOKEN found in path variables");
  }

  const accessToken = process.env.DIGITAL_OCEAN_TOKEN;

  log.debug(`Digital Ocean API Request: `, {
    method,
    url: `https://api.digitalocean.com/v2/${path}`,
  });

  const response = await fetch(`https://api.digitalocean.com/v2/${path}`, {
    expectStatus,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method,
    timeoutMs: 3000,
    body,
  });

  if (expectStatus) {
    if (response.status !== expectStatus) {
      throw new Error(
        `DigitalOcean API request expected status ${expectStatus}. Got instead ${response.status}`
      );
    }
  }

  try {
    return JSON.parse(response.bodyText) as Promise<T>;
  } catch (e) {
    log.error("Error with DigitalOcean request", {
      message: e.message,
    });
    throw e;
  }
}
