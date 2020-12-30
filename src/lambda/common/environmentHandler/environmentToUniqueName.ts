import { Environment } from "../../common/environment";

export function environmentToUniqueName(
  environment: Pick<Environment, "id" | "subdomain">
) {
  return `sy-${environment.id}-${environment.subdomain}`;
}
