import { getEnvironmentThatNeedsWork } from "../common/environment";

/**
 * Takes an environment that needs work done on it, ticks it over to a
 * liminal status (e.g., "*ing"), and performs the work. If we're in a
 * long-running liminal status, we check the status again against our env
 * handler, and either update the status OR do nothing, and keep waiting...
 */
export async function processEnvironment() {}
