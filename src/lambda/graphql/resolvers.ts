import { user } from "./resolvers/user";
import { repositories } from "./resolvers/user/repositories";
import { gitHub } from "./resolvers/user/repositories/gitHub";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    ping: () => "pong",
    user,
  },
  User: {
    repositories,
  },
  Repositories: {
    gitHub,
  },
};
