function logger(level: "debug" | "error" | "log" | "warning", ...data: any[]) {
  console[level](...data);
}

export const log = {
  error: (...data: any[]) => logger("error", ...data),
  debug: (...data: any[]) => logger("debug", ...data),
  info: (...data: any[]) => logger("log", ...data),
  warning: (...data: any[]) => logger("warning", ...data),
};
