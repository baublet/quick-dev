import fetch from "node-fetch";

import { log } from "../../../../common/logger";

export function digitalOceanApi<T = any>({
  body,
  path,
  method = "post",
}: {
  path: string;
  method?: "post" | "delete" | "get";
  body?: Record<string, any>;
}): Promise<T> {
  if (!process.env.DIGITAL_OCEAN_TOKEN) {
    throw new Error("No DIGITAL_OCEAN_TOKEN found in path variables");
  }

  const accessToken = process.env.DIGITAL_OCEAN_TOKEN;

  log.debug(`Digital Ocean API Request: `, {
    method,
    url: `https://api.digitalocean.com/v2/${path}`,
  });

  const options: fetch.RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return fetch(`https://api.digitalocean.com/v2/${path}`, options).then(
    (response) => {
      try {
        return response.json();
      } catch (e) {
        log.error("Error with DigitalOcean request: ", {
          message: e.message,
        });
        return {};
      }
    }
  ) as Promise<T>;
}
