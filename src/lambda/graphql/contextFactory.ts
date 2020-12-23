export function contextFactory() {
  console.log({ arguments });
  return { hello: "world" };
}
