import { Response } from "express";

exports.helloHandler = async function (req: unknown, response: Response) {
  response.json({ hello: "world" });
};
