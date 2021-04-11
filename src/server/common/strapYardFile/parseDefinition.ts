import yaml from "js-yaml";

import { ParsedDefinitionFile } from "./index";

export async function parseDefinition(
  repositoryUrl: string,
  def: string
): Promise<ParsedDefinitionFile> {
  const parsed = yaml.load(def);

  if (parsed.steps && !Array.isArray(parsed.steps)) {
    throw new Error(
      "Step file is invalid. Expected an array of steps\n\n" + def
    );
  }

  return {
    name: parsed.name || "",
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
