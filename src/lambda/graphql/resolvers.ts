import { user } from "./resolvers/user";
import { repositories } from "./resolvers/user/repositories";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    ping: () => "pong",
    user,
  },
  User: {
    repositories,
  },
};
