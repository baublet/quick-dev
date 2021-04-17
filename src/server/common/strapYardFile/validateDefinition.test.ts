import { validateDefinition } from "./validateDefinition";

it.each([
  validateDefinition(123),
  validateDefinition({}),
  validateDefinition({ narf: "flarg" }),
  validateDefinition({ name: "name" }),
  validateDefinition({ steps: "not right" }),
  validateDefinition({
    steps: ["this works", { but: "not this" }],
  }),
  validateDefinition({
    image: "invalid image",
    steps: ["bad step"],
  }),
])("throws if invalid", async (promise) => {
  await expect(promise).rejects.toEqual(expect.anything());
});

it.each([
  validateDefinition({
    image: "ubuntu-18-04-x64",
    steps: [{ command: "good step" }],
  }),
  validateDefinition({
    image: "ubuntu-18-04-x64",
    steps: [{ name: "also a good step", command: "command" }],
  }),
])("doesn't throw if valid", async (promise) => {
  await expect(promise).resolves.toEqual(expect.anything());
});
