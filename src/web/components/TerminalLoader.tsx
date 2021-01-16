import React from "react";

function next(ch: string): string {
  if (ch === "|") return "/";
  if (ch === "/") return "—";
  if (ch === "—") return "\\";
  return "|";
}

export function TerminalLoader() {
  const [char, setChar] = React.useState("|");

  React.useEffect(() => {
    const interval = setInterval(() => setChar((ch) => next(ch)), 200);
    return () => clearInterval(interval);
  }, []);

  return <span>{char}</span>;
}
