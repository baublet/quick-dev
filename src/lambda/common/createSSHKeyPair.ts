import path from "path";
import fs from "fs";
import sshKeygen from "ssh-keygen";
import { ulid } from "ulid";

import { log } from "../../common/logger";

export async function createSSHKeyPair(
  email: string,
  password: string | false = false
): Promise<{ privateKey: string; publicKey: string }> {
  return new Promise((resolve, reject) => {
    const id = ulid();
    const location = path.resolve(process.cwd(), "tmp", id);
    const comment = email;
    const format = "RFC4716";

    sshKeygen(
      {
        location: location,
        comment: comment,
        password: password,
        read: true,
        format: format,
      },
      (err, out) => {
        if (err) {
          log.error(err);
          return reject("SSH key gen error " + err);
        }
        fs.unlink(location, () => {
          fs.unlink(`${location}.pub`, () => {
            resolve({
              privateKey: out.key,
              publicKey: out.pubKey,
            });
          });
        });
      }
    );
  });
}
