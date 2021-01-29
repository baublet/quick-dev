import { user } from "./resolvers/user";
import { repositories } from "./resolvers/user/repositories";
import { gitHub } from "./resolvers/user/repositories/gitHub";
import { environments } from "./resolvers/user/environments";

import { environment } from "./resolvers/environment";
import { environmentLogs } from "./resolvers/environment/logs";
import { environmentWorking } from "./resolvers/environment/working";
import { environmentPermissions } from "./resolvers/environment/permissions";
import { environmentCommandLogs } from "./resolvers/environmentCommand/logs";

import { environmentCommandLogs as environmentCommandLogsQuery } from "./resolvers/environmentCommandLogs";

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
    environmentCommandLogs: environmentCommandLogsQuery,
  },
  Mutation: {
    createEnvironment,
    deleteEnvironment,
  },
  EnvironmentCommand: {
    logs: environmentCommandLogs,
  },
  Environment: {
    logs: environmentLogs,
    permissions: environmentPermissions,
    working: environmentWorking,
  },
  User: {
    repositories,
    environments,
  },
  Repositories: {
    gitHub,
  },
};
