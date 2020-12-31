require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();

import { APIGatewayEvent } from "aws-lambda";
import path from "path";
import fs from "fs";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import { getBySecret } from "./common/environment";

const PROVISIONER_PATH = path.resolve(process.cwd(), "dist", "provisioner.js");

async function getProvisionerScript(): Promise<string> {
  return new Promise<string>((resolve) => {
    if (!fs.existsSync(PROVISIONER_PATH)) {
      return resolve("// Provisioner doesn't exist yet!");
    }
    fs.readFile(PROVISIONER_PATH, (err, data) => {
      resolve(data.toString());
    });
  });
}

// Uses Rollup to build our Provisioner if it hasn't been built yet. Then it
// returns the bundled source for executing via nodejs in dev environments
export const handler = async (event: APIGatewayEvent) => {
  return {
    statusCode: 200,
    body: await getProvisionerScript(),
  };
};
