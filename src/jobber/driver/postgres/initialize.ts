import { JobberPostgresDriver } from ".";

async function getMigrationsToRun(): Promise<string[]> {
  return [];
}

export async function initialize(driver: JobberPostgresDriver) {
  const {} = driver;
}
