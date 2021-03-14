import { Application } from "express";
import bodyParser from "body-parser";

import { verifySecret } from "./index";
import { config } from "./config";

export function admin(app: Application) {
  app.post(
    "/setStrapYardUrl",
    bodyParser.text(),
    verifySecret,
    async (req, res) => {
      const strapYardUrl = req.body;
      config.setStrapYardUrl(strapYardUrl);
      res.send(204);
    }
  );

  app.post("/setSecret", bodyParser.text(), verifySecret, async (req, res) => {
    const secret = req.body;
    config.setSecret(secret);
    res.send(204);
  });
}
