import React from "react";
import { BrowserRouter } from "react-router-dom";

import { GraphQLProvider } from "../GraphQLProvider";
import { AuthProvider } from "../useAuth";
import { Header } from "./Header";
import { Routes } from "./Routes";

export function Application() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GraphQLProvider>
          <Header />
          <main>
            <Routes />
          </main>
        </GraphQLProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
