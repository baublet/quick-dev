import fs from "fs";
import path from "path";
import { runCommand } from "./runCommand";

const logPath = path.resolve(__dirname, "runCommand.log");

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

fs.writeFileSync(logPath, "");

it("writes the file", async () => {
  await runCommand("runCommand", "echo 'hi'; sleep 1; echo 'hi2'", logPath);
  await wait(100);
  expect(fs.readFileSync(logPath).toString()).toEqual("hi\n");
  await wait(1000);
  expect(fs.readFileSync(logPath).toString()).toEqual("hi\nhi2\n");
});
