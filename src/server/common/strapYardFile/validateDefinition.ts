import yup from "yup";

import { ValidDefinitionFile } from ".";
import images from "./images";

const schema = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  image: yup
    .mixed()
    .oneOf(images.map((image) => image.slug))
    .default(images[0].slug),
  steps: yup.array().of(
    yup.mixed().oneOf([
      yup.string(),
      yup.object().shape({
        name: yup.string(),
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
