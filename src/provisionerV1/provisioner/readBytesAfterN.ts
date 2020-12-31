import fs from "fs";

export async function readBytesAfterN(
  file: string,
  after: number
): Promise<string> {
  return new Promise((resolve) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        console.error({ err });
        return resolve("");
      }
      const fileSize = stats.size;
      const bytesToRead = fileSize - after;
      if (bytesToRead < 1) {
        return resolve("");
      }
      fs.open(file, "r", (errOpen, fd) => {
        fs.read(
          fd,
          Buffer.alloc(bytesToRead),
          0,
          bytesToRead,
          after,
          (errRead, bytesRead, buffer) => {
            resolve(buffer.toString("utf8"));
          }
        );
      });
    });
  });
}
