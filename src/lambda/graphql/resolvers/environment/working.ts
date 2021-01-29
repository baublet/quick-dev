import { Environment } from "../../../common/entities";

export async function environmentWorking(parent: Environment) {
  switch (parent.lifecycleStatus) {
    case "creating":
    case "provisioning":
      return true;
  }
  return false;
}
