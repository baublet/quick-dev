import React from "react";
import AnsiUp from "ansi_up";

export function LogOutput({
  logText = "",
  footer,
}: {
  logText?: string | { id: string; logOutput: string }[];
  footer?: JSX.Element;
}) {
  const ansiParser = new AnsiUp();
  return (
    <div
      className="overflow-x-auto font-mono p-2 bg-gray-800 overflow-y-scroll text-gray-200 max-w-full"
      style={{
        minHeight: "40vh",
        maxHeight: "60vh",
      }}
    >
      {typeof logText === "string" ? (
        <pre className="max-w-full">{ansiParser.ansi_to_html(logText)}</pre>
      ) : (
        <pre className="max-w-full">
          {logText.map((logLine) => (
            <div
              key={logLine.id}
              dangerouslySetInnerHTML={{
                __html: ansiParser.ansi_to_html(logLine.logOutput),
              }}
            />
          ))}
        </pre>
      )}
      {footer && footer}
    </div>
  );
}
