import { CreateEnvironmentMutationInput } from "../../../graphql/generated";
import { Context } from "../../context";

export interface SetNewArguments {
  input: CreateEnvironmentMutationInput;
  context: Context;
}

export { canSetNew } from "./canSetNew";
export { setNew } from "./setNew";
