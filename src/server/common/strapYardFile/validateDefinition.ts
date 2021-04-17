import yup from "yup";

import { ValidDefinitionFile } from ".";

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  steps: yup.array().of(
    yup.mixed().oneOf([
      yup.string(),
      yup.object().shape({
        name: yup.string().required(),
        command: yup.string().required(),
      }),
    ])
  ),
});

export function validateDefinition(
  definition: any
): asserts definition is ValidDefinitionFile {
  schema.validateSync(definition);
}
