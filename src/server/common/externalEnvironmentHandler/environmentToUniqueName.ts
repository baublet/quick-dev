import { Environment } from "../entities";

export function environmentToUniqueName(
  environment: Pick<Environment, "id" | "subdomain">
) {
  return `sy-${environment.subdomain}`;
}
