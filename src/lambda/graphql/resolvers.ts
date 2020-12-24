import { user } from "./resolvers/user";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    ping: () => "pong",
    user,
  },
};
