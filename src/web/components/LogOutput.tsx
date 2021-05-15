import React from "react";
import AnsiUp from "ansi_up";

export function LogOutput({
  logText = "",
  footer,
  header,
}: {
  logText?: string;
  footer?: JSX.Element;
  header?: JSX.Element;
}) {
  const ansiParser = new AnsiUp();
  const [lockScroll] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = scrollRef?.current;
    if (!lockScroll || !element) {
      return;
    }

    element.scrollTop = element.scrollHeight;
  }, [logText]);

  return (
    <div
      className="overflow-x-auto font-mono p-2 bg-gray-800 overflow-y-scroll text-gray-200 max-w-full"
      style={{
        minHeight: "40vh",
        maxHeight: "60vh",
      }}
      ref={scrollRef}
    >
      {header && header}
      <pre
        className="max-w-full"
        dangerouslySetInnerHTML={{
          __html: ansiParser.ansi_to_html(logText),
        }}
      />
      {footer && footer}
    </div>
  );
}
