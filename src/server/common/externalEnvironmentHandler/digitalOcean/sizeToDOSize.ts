import { Environment } from "../../../common/entities";

// With DO pricing for calculating billing
type DigitalOceanSize =
  | "s-1vcpu-1gb" // 0.007
  | "s-2vcpu-2gb" // 0.022
  | "s-2vcpu-4gb" // 0.030
  | "s-4vcpu-8gb" // 0.060
  | "s-8vcpu-16gb"; // 0.119

// Don't forget to include snapshots in pricing, once we get there

type SizeKeys = Pick<Environment, "size">["size"];

const SIZE_TRANSLATION: Record<SizeKeys, DigitalOceanSize> = {
  s: "s-1vcpu-1gb",
  m: "s-2vcpu-2gb",
  l: "s-2vcpu-4gb",
  xl: "s-4vcpu-8gb",
  xxl: "s-8vcpu-16gb",
};

export function sizeToDOSize(
  environment: Pick<Environment, "size">["size"]
): DigitalOceanSize {
  return SIZE_TRANSLATION[environment];
}
