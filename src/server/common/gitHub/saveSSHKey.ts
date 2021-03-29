import { log } from "../../../common/logger";
import { githubApi } from "./githubApi";
import { Context } from "../context";

interface GitHubCreateSSHKeyResponse {
  key_id: string;
  key: string;
  id: number;
  url: string;
  title: string;
  created_at: string;
  verified: boolean;
  read_only: boolean;
}

export interface GitHubSSHKey {
  id: string;
  title: string;
}

export async function saveSSHKey(
  context: Context,
  publicKey: string,
  title: string
): Promise<GitHubSSHKey | null> {
  const accessToken = context.accessToken;
  if (!accessToken) {
    return null;
  }

  const fetchResponse = (await githubApi({
    path: "user/keys",
    accessToken,
    method: "post",
    body: {
      title,
      key: publicKey,
    },
    expectStatus: 201,
  })) as GitHubCreateSSHKeyResponse;

  log.debug("GitHub save key response: ", fetchResponse);

  if (!fetchResponse.id) {
    return null;
  }

  const keyData: GitHubSSHKey = {
    id: fetchResponse.key_id,
    title: fetchResponse.title,
  };

  return keyData;
}
