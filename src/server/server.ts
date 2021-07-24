import express, { response } from "express";
import path from "path";
import cookieParser from "cookie-parser";

import { githubHandler } from "./github";
import { applyGraphqlMiddleware } from "./graphql";

const app = express();

// Early-stage middleware
app.use(cookieParser());

// Authentication middleware
app.get("/auth/github", githubHandler);

applyGraphqlMiddleware(app).then(() => {
  // Send any static assets
  app.use(express.static(path.resolve(process.cwd(), "builtWeb")));

  // Log out
  app.get("/logout", (request, response) => {
    response.clearCookie("auth");
    response.sendFile(path.resolve(process.cwd(), "builtWeb", "index.html"));
  });

  // Finally, if all else fails, send the index for the FE to try to route it
  app.get("*", (request, response) => {
    response.sendFile(path.resolve(process.cwd(), "builtWeb", "index.html"));
  });

  app.listen(8888);
  console.log("Server listening on port 8888");
});
