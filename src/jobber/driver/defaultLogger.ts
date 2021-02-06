export function defaultLogger(
  level: "error" | "debug" | "info" | "warn",
  message: string,
  ...data: any[]
) {
  console[level](message, ...data);
}
