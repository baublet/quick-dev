import fetch from "node-fetch";
import { log } from "../../../common/logger";

export async function githubApi<T = any>({
  accessToken,
  path,
  body,
  method = "get",
  expectStatus,
}: {
  accessToken: string;
  path: string;
  body?: Record<string, any>;
  method?: "get" | "post";
  expectStatus?: number;
}): Promise<T> {
  const options: Record<string, any> = {
    method,
    headers: {
      authorization: `bearer ${accessToken}`,
    },
  };

  const url = `https://api.github.com/${path}`;
  if (body) {
    options.body = JSON.stringify(body);
  }

  log.debug("GitHub API request", {
    url,
    options,
  });

  const response = await fetch(url, options);

  if (expectStatus) {
    if (response.status !== expectStatus) {
      throw new Error(
        `Expected GitHub API request status to be ${expectStatus}. Got ${response.status}`
      );
    }
  }

  return response.json() as Promise<T>;
}
