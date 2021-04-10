import { Request, Response } from "express";
import FormData from "form-data";
import fetch from "node-fetch";

import { log } from "../common/logger";

export const githubHandler = async (request: Request, response: Response) => {
  const data = new FormData();
  data.append("client_id", process.env.GITHUB_CLIENT_ID);
  data.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
  data.append("code", request.query.code);
  data.append("redirect_uri", process.env.GITHUB_CLIENT_REDIRECT_URI);

  // Request to exchange code for an access token
  const paramsString = await fetch(
    `https://github.com/login/oauth/access_token`,
    {
      method: "POST",
      body: data,
    }
  ).then((response) => response.text());

  const params = new URLSearchParams(paramsString);
  const accessToken = params.get("access_token");

  response.cookie("auth", accessToken, {
    httpOnly: true,
  });
  response.redirect("/");
};
