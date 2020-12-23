require("@babel/polyfill/noConflict");

import { ApolloServer } from "apollo-server-lambda";
import fs from "fs";
import path from "path";

import { resolvers } from "./graphql/resolvers";
import { contextFactory as context } from "./graphql/contextFactory";

const schemaPath = path.resolve(
  process.cwd(),
  "src",
  "lambda",
  "graphql",
  "schema.graphql"
);
const typeDefs = fs.readFileSync(schemaPath).toString();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: {
    endpoint: "/.netlify/functions/graphql"
  },
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  },
});
