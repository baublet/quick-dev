import { Environment } from "./generated";

import { user } from "./resolvers/user";
import { repositories } from "./resolvers/user/repositories";
import { gitHub } from "./resolvers/user/repositories/gitHub";
import { environments } from "./resolvers/user/environments";

import { environment } from "./resolvers/environment";
import { environmentLogs } from "./resolvers/environment/logs";
import { environmentWorking } from "./resolvers/environment/working";
import { environmentPermissions } from "./resolvers/environment/permissions";
import { environmentCommandLogs } from "./resolvers/environmentCommand/logs";
import { environmentSecret } from "./resolvers/environment/secret";
import { environmentImage } from "./resolvers/environment/image";

import { environmentCommandLogs as environmentCommandLogsQuery } from "./resolvers/environmentCommandLogs";

// Mutations
import { createEnvironment } from "./resolvers/createEnvironment";
import { deleteEnvironment } from "./resolvers/deleteEnvironment";
import { stopEnvironment } from "./resolvers/stopEnvironment";
import { startEnvironment } from "./resolvers/startEnvironment";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    environment,
    ping: () => "pong",
    user,
    environmentCommandLogs: environmentCommandLogsQuery,
  },
  Mutation: {
    createEnvironment,
    deleteEnvironment,
    stopEnvironment,
    startEnvironment,
  },
  EnvironmentCommand: {
    logs: environmentCommandLogs,
  },
  Environment: {
    logs: environmentLogs,
    permissions: environmentPermissions,
    working: environmentWorking,
    repositoryHttpUrl: (parent: Environment) =>
      parent.repositoryUrl.replace("git://", "https://"),
    url: (parent: Environment) =>
      `https://${parent.subdomain}.env.${process.env.STRAPYARD_DOMAIN}`,
    secret: environmentSecret,
    image: environmentImage,
  },
  User: {
    repositories,
    environments,
  },
  Repositories: {
    gitHub,
  },
};
