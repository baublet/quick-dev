require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";
import path from "path";
import fs from "fs";

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

export const handler = async (event: APIGatewayEvent) => {
  return {
    statusCode: 200,
    body: await getProvisionerScript(),
  };
};
