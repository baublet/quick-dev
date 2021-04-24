import yaml from "js-yaml";

import { ParsedDefinitionFile, ValidDefinitionFile } from "./index";
import { validateDefinition } from "./validateDefinition";
import { images, ImageSlug } from "./images";

export async function parseDefinition(
  repositoryUrl: string,
  def: string
): Promise<ParsedDefinitionFile> {
  const parsed = yaml.load(def);

  validateDefinition(parsed);
  assertParsedFileType(parsed);

  return {
    name: parsed.name || "",
    image: parsed.image || (Object.keys(images)[0] as ImageSlug),
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

type PartialValidDefinitionFile = Partial<ValidDefinitionFile>;

function assertParsedFileType(
  parsedFile: any
): asserts parsedFile is PartialValidDefinitionFile {
  if (typeof parsedFile !== "object") {
    throw new Error("StrapYard file is not an object!");
  }

  if (parsedFile.image) {
    if (!(parsedFile.image in images)) {
      throw new Error(
        `StrapYard file image is not a valid image: ${parsedFile.image}`
      );
    }
  }
}
