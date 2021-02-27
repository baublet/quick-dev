import fs from "fs";

export function log(text: string, ...data: any[]) {
  console.log(text, data);
  fs.appendFileSync(
    process.cwd() + "/strapyard.log",
    text + JSON.stringify(data) + "\n"
  );
}
