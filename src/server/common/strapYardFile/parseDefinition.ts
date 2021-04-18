import yaml from "js-yaml";

import { ParsedDefinitionFile } from "./index";
import { validateDefinition } from "./validateDefinition";
import { images } from "./images";

export async function parseDefinition(
  repositoryUrl: string,
  def: string
): Promise<ParsedDefinitionFile> {
  const parsed = yaml.load(def);

  validateDefinition(parsed);

  return {
    name: parsed.name || "",
    image: parsed.image || Object.keys(images)[0],
    description: parsed.description || "",
    rawFile: def,
    repositoryUrl,
    steps: (parsed.steps || []).map((step: any) => {
      assertStepValid(step);
      return {
        name: step.name || step.command,
        command: step.command,
      };
    }),
  };
}

function assertStepValid(step: any) {
  if (!step.command) {
    throw new Error(
      `All steps require a command. This step doesn't have one: ${JSON.stringify(
        step
      )}`
    );
  }
}
