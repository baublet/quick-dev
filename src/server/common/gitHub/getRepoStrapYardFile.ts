import { Context } from "../context";
import { githubApi } from "./githubApi";
import { ParsedDefinitionFile, parseDefinition } from "../strapYardFile";
import { log } from "../../../common/logger";
import { repoUrlToOwnerAndName } from "./repoUrlToOwnerAndName";

interface GitHubStrapYardFileResponse {
  type: string;
  encoding: "base64";
  size: number;
  name: string;
  content: string;
}

export async function getRepoStrapYardFile(
  context: Context,
  repoUrl: string
): Promise<string | ParsedDefinitionFile> {
  const { owner, name } = repoUrlToOwnerAndName(repoUrl);
  try {
    const fetchResponse = await githubApi<GitHubStrapYardFileResponse>({
      path: `repos/${owner}/${name}/contents/strapyard.yml`,
      method: "get",
      accessToken: context.accessToken || "",
      expectStatus: 200,
    });

    try {
      const file = Buffer.from(
        fetchResponse.content,
        fetchResponse.encoding
      ).toString("utf8");
      return await parseDefinition(repoUrl, file);
    } catch (e) {
      log.error("Error parsing StrapYard file:", {
        message: e.message,
        stack: e.stack,
      });
      return e.message;
    }
  } catch (e) {
    log.error("Error loading StrapYard file:", {
      message: e.message,
      stack: e.stack,
    });
    return "No StrapYard file found";
  }
}
