import { user } from "./resolvers/user";
import { repositories } from "./resolvers/user/repositories";
import { gitHub } from "./resolvers/user/repositories/gitHub";
import { environments } from "./resolvers/user/environments";

// Mutations
import { createEnvironment } from "./resolvers/createEnvironment";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    ping: () => "pong",
    user,
  },
  Mutation: {
    createEnvironment,
  },
  User: {
    repositories,
    environments,
  },
  Repositories: {
    gitHub,
  },
};
