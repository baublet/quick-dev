import { log } from "../../../../common/logger";

export function defaultLogger(
  level: "error" | "debug" | "info" | "warn",
  message: string,
  ...data: any[]
) {
  log[level](message, ...data);
}
