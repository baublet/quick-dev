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

  // Request to return data of a user that has been authenticated
  const fetchResponse = await fetch(
    `https://api.github.com/user?access_token=${accessToken}&scope=${scope}&token_type=${tokenType}`
  ).then((response) => response.json());

  console.log(fetchResponse);
};
