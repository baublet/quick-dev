import { readFile } from "fs";
import path from "path";

import { log } from "../common/logger";
import { getCurrentUrl } from "../lambda/common/getCurrentUrl";
import { Environment } from "../lambda/common/environment";

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
  const url = await getCurrentUrl();
  return new Promise((resolve) => {
    readFile(
      path.resolve(process.cwd(), "src", "provisionerV1", "provision.sh"),
      (err, data) => {
        if (err) {
          log.error(err);
          process.exit(1);
        }

        const fileData = data.toString();
        const replacedFile = replace(fileData, [
          {
            needle: /\$STRAPYARD_SUBDOMAIN/g,
            replaceWith: environment.subdomain,
          },
          {
            needle: /\$STRAPYARD_URL/g,
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
