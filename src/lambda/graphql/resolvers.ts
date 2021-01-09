import { user } from "./resolvers/user";
import { repositories } from "./resolvers/user/repositories";
import { gitHub } from "./resolvers/user/repositories/gitHub";
import { environments } from "./resolvers/user/environments";

import { environment } from "./resolvers/environment";
import { environmentLogs } from "./resolvers/environment/logs";
import { environmentPermissions } from "./resolvers/environment/permissions";
import { environmentCommandLogChunks } from "./resolvers/environmentCommand/logChunks";

import { jobs } from "./resolvers/jobs";

// Mutations
import { createEnvironment } from "./resolvers/createEnvironment";
import { deleteEnvironment } from "./resolvers/deleteEnvironment";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    environment,
    ping: () => "pong",
    user,
    jobs,
  },
  Mutation: {
    createEnvironment,
    deleteEnvironment,
  },
  EnvironmentCommand: {
    logChunks: environmentCommandLogChunks,
  },
  Environment: {
    logs: environmentLogs,
    permissions: environmentPermissions,
  },
  User: {
    repositories,
    environments,
  },
  Repositories: {
    gitHub,
  },
};
