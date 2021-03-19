require("./common/initialize");

import { ApolloServer } from "apollo-server-lambda";
import fs from "fs";
import path from "path";

import { resolvers } from "./graphql/resolvers";
import { contextFactory as context } from "./graphql/contextFactory";

declare global {
  module NodeJS {
    interface Global {
      graphqlHandlerFunction: Function;
    }
  }
}

if (!global.graphqlHandlerFunction) {
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
      endpoint: "/.netlify/functions/graphql",
      settings: {
        "request.credentials": "same-origin",
      },
    },
  });

  global.graphqlHandlerFunction = server.createHandler({
    cors: {
      origin: "*",
      credentials: true,
    },
  });
}

exports.handler = global.graphqlHandlerFunction;
