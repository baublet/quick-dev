const debug = process.env.DEBUG === "true";

function logger(level: "debug" | "error" | "log" | "warning", ...data: any[]) {
  const stringData = JSON.stringify(data);
  console[level](stringData);
}

export const log = {
  error: (...data: any[]) => logger("error", ...data),
  debug: (...data: any[]) => {
    if (!debug) return;
    logger("log", ...data);
  },
  info: (...data: any[]) => logger("log", ...data),
  warning: (...data: any[]) => logger("warning", ...data),
};
