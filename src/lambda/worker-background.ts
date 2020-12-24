require("@babel/polyfill/noConflict");
require("dotenv").config();

import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {};
