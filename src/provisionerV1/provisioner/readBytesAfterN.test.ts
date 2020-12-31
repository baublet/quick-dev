import path from "path";
import { readBytesAfterN } from "./readBytesAfterN";

const file = path.resolve(__dirname, "./readBytesAfterN.testFile");

it("returns '' if the person enters 5 or more", async () => {
  await expect(readBytesAfterN(file, 5)).resolves.toEqual("");
  await expect(readBytesAfterN(file, 6)).resolves.toEqual("");
});

it("returns the right string", async () => {
  await expect(readBytesAfterN(file, 0)).resolves.toEqual("12345");
  await expect(readBytesAfterN(file, 3)).resolves.toEqual("45");
});
