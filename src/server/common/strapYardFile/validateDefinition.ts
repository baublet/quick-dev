import * as yup from "yup";

import { ValidDefinitionFile } from ".";
import { log } from "../../../common/logger";
import { images } from "./images";

const schema = yup
  .object({
    name: yup.string().optional(),
    description: yup.string().optional(),
    image: yup
      .mixed()
      .oneOf(Object.keys(images))
      .default(Object.keys(images)[0]),
    steps: yup
      .array(
        yup
          .object({
            name: yup.string(),
            command: yup.string().required(),
          })
          .noUnknown()
      )
      .required(),
  })
  .noUnknown();

function isValid(definition: any): asserts definition is ValidDefinitionFile {
  return;
}

export async function validateDefinition(
  definition: any
): Promise<ValidDefinitionFile> {
  try {
    await schema.validate(definition);
    isValid(definition);
    return definition;
  } catch (e) {
    log.debug("Invalid StrapYard file!", {
      error: e.message,
      definition,
    });
    throw e;
  }
}
