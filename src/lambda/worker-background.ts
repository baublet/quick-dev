require("./common/initialize");

import { scheduleJob } from "./worker-background/scheduleJob";
import { createHumanReadableId } from "./common/createHumanReadableId";
import { doAJob } from "./worker-background/doAJob";
import { cancelTimedOutJob } from "./worker-background/cancelTimedOutJob";

const maxBeats = 3;

export const handler = async () => {
  const processor = createHumanReadableId();

  for (let i = 0; i < maxBeats; i++) {
    await scheduleJob(processor);
    await doAJob(processor);
    // await cancelTimedOutJob(processor);
  }
};
