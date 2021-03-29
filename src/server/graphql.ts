import fs from "fs";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import express from "express";

import { resolvers } from "./graphql/resolvers";
import { contextFactory as context } from "./graphql/contextFactory";

const schemaPath = path.resolve(
  process.cwd(),
  "src",
  "server",
  "graphql",
  "schema.graphql"
);
const typeDefs = fs.readFileSync(schemaPath).toString();

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: {
    endpoint: "/.netlify/functions/graphql",
    settings: {
      "request.credentials": "same-origin",
    },
  },
});

export async function applyGraphqlMiddleware(app: express.Express) {
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app, path: "/.netlify/functions/graphql" });
  console.log(`GraphQL ready at ${graphqlServer.graphqlPath}`);
}
