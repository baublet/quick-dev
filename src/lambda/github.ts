require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";
import FormData from "form-data";
import fetch from "node-fetch";

export const handler = async (event: APIGatewayEvent) => {
  const {
    client_id: clientId,
    redirect_uri: redirectUri,
    client_secret: clientSecret,
    code,
  } = JSON.parse(event.body);

  const data = new FormData();
  data.append("client_id", clientId);
  data.append("client_secret", clientSecret);
  data.append("code", code);
  data.append("redirect_uri", redirectUri);

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
  const scope = params.get("scope");
  const tokenType = params.get("token_type");
  const cookieValue = encodeURI(`${accessToken}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      accessToken,
      scope,
      tokenType,
    }),
    headers: {
      "Set-Cookie": `auth=${cookieValue}; Path=/; HttpOnly`,
    },
  };
};
