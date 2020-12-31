import { createSSHKeyPair } from "./createSSHKeyPair";

it("creates a key pair", async () => {
  await expect(createSSHKeyPair("test@test.com")).resolves.toEqual({
    publicKey: expect.any(String),
    privateKey: expect.any(String),
  });
});
