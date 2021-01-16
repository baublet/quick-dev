import React from "react";

import { TerminalLoader } from "./TerminalLoader";

export function LogOutput({
  logText = "",
  streaming = false,
}: {
  logText?: string;
  streaming?: boolean;
}) {
  return (
    <div
      className="overflow-x-auto font-mono p-2 bg-gray-800 overflow-y-scroll text-gray-200 max-w-full"
      style={{
        maxHeight: "60vh",
      }}
    >
      <pre className="max-w-full">{logText}</pre>
      {!streaming ? null : <TerminalLoader />}
    </div>
  );
}
