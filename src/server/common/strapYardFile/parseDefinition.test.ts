import { parseDefinition } from "./parseDefinition";

const repoUrl = "repoUrl";

it("supplies the name", async () => {
  await expect(parseDefinition(repoUrl, "name: Testing, 123")).resolves.toEqual(
    {
      description: "",
      name: "Testing, 123",
      rawFile: "name: Testing, 123",
      repositoryUrl: "repoUrl",
      steps: [],
    }
  );
});

it("supplies the description", async () => {
  await expect(
    parseDefinition(repoUrl, "description: Testing, 123")
  ).resolves.toEqual({
    name: "",
    description: "Testing, 123",
    rawFile: "description: Testing, 123",
    repositoryUrl: "repoUrl",
    steps: [],
  });
});

it("parses steps", async () => {
  const yml = `
name: Testing initial steps

description: StrapYard test file to test steps

steps:

  - name: Do a thing
    command: whoami

  - name: Do another thing
    command: this is a
      multiline command
`;

  await expect(parseDefinition(repoUrl, yml)).resolves.toEqual({
    name: "Testing initial steps",
    description: "StrapYard test file to test steps",
    rawFile: yml,
    repositoryUrl: "repoUrl",
    steps: [
      {
        name: "Do a thing",
        command: "whoami",
      },
      {
        name: "Do another thing",
        command: "this is a multiline command",
      },
    ],
  });
});

it("throws with an invalid step", async () => {
  const yml = `
steps:
  - name: do a thing
`;

  await expect(parseDefinition(repoUrl, yml)).rejects.toEqual(
    new Error(
      `All steps require a command. This step doesn't have one: {"name":"do a thing"}`
    )
  );
});
