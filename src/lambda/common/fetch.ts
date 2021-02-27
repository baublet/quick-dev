import _fetch from "node-fetch";
import AbortController from "abort-controller";

import { log } from "../../common/logger";

function body(
  bodyInput: undefined | string | Record<string, any>
): string | undefined {
  if (!body) return undefined;
  if (typeof bodyInput === "string") return bodyInput;
  return JSON.stringify(bodyInput);
}

export async function fetch(
  url: string,
  options: {
    method: "get" | "post" | "patch" | "delete";
    headers: Record<string, string>;
    expectStatus?: number;
    timeoutMs: number;
    body?: string | Record<string, any>;
  }
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    log.error("Fetch command timeout", { url, method: options.method });
  }, options.timeoutMs);

  const fetchOptions: _fetch.RequestInit = {
    method: options.method,
    headers: options.headers,
    signal: controller.signal,
  };

  if (options.body) {
    fetchOptions.body = body(options.body);
  }

  const response = await _fetch(url, {
    method: options.method,
    headers: options.headers,
    signal: controller.signal,
    body: body(options.body),
  });

  clearTimeout(timeout);
  const bodyText = await response.text();

  if (options.expectStatus !== undefined) {
    if (response.status !== options.expectStatus) {
      log.error(
        `Error sending request to ${url}. Expected status ${options.expectStatus}. Received ${response.status}`,
        {
          url,
          options,
          bodyText,
          status: response.status,
        }
      );
    }
  }

  return {
    bodyText,
    status: response.status,
  };
}
