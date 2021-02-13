require("./common/initialize");

import { getJobSystem } from "./common/jobs/getJobSystem";

const maxBeats = 3;
const workers = ["larry", "curly", "mo"];

export const handler = async () => {
  const jobSystem = await getJobSystem();

  for (let i = 0; i < maxBeats; i++) {
    await jobSystem.schedulerTick();
    await Promise.all(workers.map((worker) => jobSystem.workerTick(worker)));
  }
};
