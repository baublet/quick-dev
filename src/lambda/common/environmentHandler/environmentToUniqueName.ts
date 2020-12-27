import { Environment } from "../../common/environment";

export function environmentToUniqueName(environment: Pick<Environment, "id">) {
  return `sy-${environment.id}`;
}
