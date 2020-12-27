import { Environment } from "../../../common/environment";

type DigitalOceanSize =
  | "s-1vcpu-1gb"
  | "s-1vcpu-2gb"
  | "s-2vcpu-2gb"
  | "s-2vcpu-4gb"
  | "s-4vcpu-8gb";

type SizeKeys = Pick<Environment, "size">["size"];

const SIZE_TRANSLATION: Record<SizeKeys, DigitalOceanSize> = {
  s: "s-1vcpu-1gb",
  m: "s-1vcpu-2gb",
  l: "s-2vcpu-2gb",
  xl: "s-2vcpu-4gb",
  xxl: "s-4vcpu-8gb",
};

export function sizeToDOSize(
  environment: Pick<Environment, "size">["size"]
): DigitalOceanSize {
  return SIZE_TRANSLATION[environment];
}
