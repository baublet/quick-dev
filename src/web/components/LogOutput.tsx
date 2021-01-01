import React from "react";

export function LogOutput({ logText="" }: { logText?: string }) {
  return (
    <div
      className="overflow-x-auto font-mono p-2 bg-gray-800 overflow-y-scroll text-gray-200 max-w-full"
      style={{
        maxHeight: "60vh",
      }}
    >
      <pre className="max-w-full">{logText}</pre>
    </div>
  );
}
