import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

export function GraphQLProvider({ children }: React.PropsWithChildren<{}>) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "/.netlify/functions/graphql",
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
