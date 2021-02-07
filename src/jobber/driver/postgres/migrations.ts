export const migrations: ({
  migrationTableName,
  workerTableName,
  jobTableName,
}: {
  migrationTableName: string;
  workerTableName: string;
  jobTableName: string;
}) => string[] = () => [];
