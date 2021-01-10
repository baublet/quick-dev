import { readFile } from "fs";
import path from "path";

import { log } from "../common/logger";
import { getCurrentUrl } from "../lambda/common/getCurrentUrl";
import type { Environment } from "../lambda/common/entities";

function replace(
  haystack: string,
  replacers: {
    needle: RegExp | string;
    replaceWith: string;
  }[]
): string {
  let recreated = haystack;

  for (const replacer of replacers) {
    recreated = recreated.replace(replacer.needle, replacer.replaceWith);
  }

  return recreated;
}

export async function getProvisionScript(
  environment: Environment
): Promise<string> {
  const url = await getCurrentUrl("public");
  return new Promise(async (resolve) => {
    readFile(
      path.resolve(process.cwd(), "src", "provisionerV1", "provision.sh"),
      (err, data) => {
        if (err) {
          log.error(err);
          return resolve("");
        }

        const fileData = data.toString();
        const replacedFile = replace(fileData, [
          {
            needle: /\$STRAPYARD_SUBDOMAIN/g,
            replaceWith: environment.subdomain,
          },
          {
            needle: /\$STRAPYARD_PUBLIC_URL/g,
            replaceWith: url,
          },
          {
            needle: /\$STRAPYARD_ENVIRONMENT_SECRET/g,
            replaceWith: environment.secret,
          },
        ]);
        resolve(replacedFile);
      }
    );
  });
}
