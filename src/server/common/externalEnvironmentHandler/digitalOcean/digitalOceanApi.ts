import hash from "object-hash";

import { fetch } from "../../fetch";
import { log } from "../../../../common/logger";
import { cache } from "../../cache";
import { partiallyConceal } from "../../../../common/partiallyConceal";

export async function digitalOceanApi<T = any>({
  body,
  path,
  method = "post",
  expectStatus,
  expectJson = true,
  timeout = 3000,
  skipCache = false,
}: {
  path: string;
  method?: "post" | "delete" | "get";
  body?: Record<string, any>;
  expectStatus?: number;
  expectJson?: boolean;
  timeout?: number;
  skipCache?: boolean;
}): Promise<T> {
  let bodyText = "";
  let responseStatus: "unknown" | number = "unknown";
  if (!process.env.DIGITAL_OCEAN_TOKEN) {
    throw new Error("No DIGITAL_OCEAN_TOKEN found in path variables");
  }

  const cacheKey = hash({
    path,
    method,
    body,
  });

  if (!skipCache) {
    const cachedValue = await cache.get(cacheKey);
    if (cachedValue) {
      log.debug("Cache hit for DO request", {
        path,
        method,
      });
      return cachedValue;
    }
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
    timeoutMs: timeout,
    body,
  });

  bodyText = response.bodyText;
  responseStatus = response.status;

  logIfRateLimitLow(response.headers, process.env.DIGITAL_OCEAN_TOKEN);

  if (expectStatus) {
    if (response.status !== expectStatus) {
      throw new Error(
        `DigitalOcean API request expected status ${expectStatus}. Got instead ${response.status}`
      );
    }
  }

  try {
    if (expectJson) {
      if (!skipCache) {
        await cache.set(cacheKey, JSON.parse(response.bodyText));
      }
      return JSON.parse(response.bodyText) as Promise<T>;
    }
    if (!skipCache) {
      await cache.set(cacheKey, response.bodyText);
    }
    return (response.bodyText as unknown) as Promise<T>;
  } catch (e) {
    log.error("Error with DigitalOcean request", {
      message: e.message,
      bodyText,
      body,
      path,
      method,
      expectStatus,
      responseStatus,
      expectJson,
      timeout,
    });
    throw e;
  }
}

function logIfRateLimitLow(headers: Record<string, string>, key: string) {
  if (!headers["ratelimit-remaining"]) {
    return;
  }

  const asNumber = parseInt(headers["ratelimit-remaining"], 10);
  if (isNaN(asNumber)) {
    return;
  }

  if (asNumber < 1000) {
    log.error("Rate limit low for DigitalOcean key!", {
      remaining: headers["ratelimit-remaining"],
      key: partiallyConceal(key),
    });
  }
}
