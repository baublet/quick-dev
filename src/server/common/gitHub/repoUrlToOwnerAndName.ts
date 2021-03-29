// Example: git://github.com/baublet/baublet.github.io.git
export function repoUrlToOwnerAndName(
  url: string
): { owner: string; name: string } {
  const urlParts = url.replace("git://github.com/", "").slice(0, -4).split("/");
  return {
    owner: urlParts[0],
    name: urlParts[1],
  };
}
