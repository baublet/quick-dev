require("./common/initialize");

import {
  stopProcessingQueue,
  processQueue,
  getQueue,
} from "./common/enqueueJob";

declare global {
  module NodeJS {
    interface Global {
      working: boolean;
    }
  }
}

export const handler = () => {
  return new Promise<void>((resolve) => {
    if (global.working) return resolve();
    global.working = true;
    processQueue();
    setTimeout(async () => {
      await stopProcessingQueue();
      global.working = false;
      resolve();
    }, 1000);
  });
};
