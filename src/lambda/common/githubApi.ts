import fetch from "node-fetch";

export async function githubApi<T = any>({
  accessToken,
  path,
  body,
}: {
  accessToken: string;
  path: string;
  body?: Record<string, any>;
}): Promise<T> {
  const options: Record<string, any> = {
    headers: {
      authorization: `bearer ${accessToken}`,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return fetch(`https://api.github.com/${path}`, options).then((response) =>
    response.json()
  ) as Promise<T>;
}
