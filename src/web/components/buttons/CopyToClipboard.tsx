import React from "react";
import cx from "classnames";
import copy from "copy-to-clipboard";

export function CopyToClipboard({
  textToCopy,
}: {
  textToCopy: string | undefined | null;
}) {
  const [showCheck, setShowCheck] = React.useState(false);

  React.useEffect(() => {
    if (!showCheck) {
      return;
    }

    const timeout = setTimeout(() => setShowCheck(false), 500);
    return () => clearTimeout(timeout);
  }, [showCheck]);

  return (
    <button
      onClick={() => {
        setShowCheck(true);
        setTimeout(() => {
          copy(textToCopy || "");
        }, 10);
      }}
      title="Copy to clipboard"
      className={
        "inline-block relative border p-1 rounded pb-0 border-transparent text-blue-400 hover:text-blue-500 hover:border-blue-100"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 333 416.25"
        x="0px"
        y="0px"
        fillRule="evenodd"
        clipRule="evenodd"
        style={{
          width: "1.5em",
          height: "1.5em",
          pointerEvents: "none",
        }}
        className={cx(
          "transition transform absolute text-green-500 opacity-0 duration-75",
          {
            "opacity-100 -translate-y-3": showCheck,
          }
        )}
      >
        <path
          fill="currentColor"
          d="M46 161c24,19 48,37 72,55 51,-69 103,-137 154,-205 21,15 41,30 62,46 -67,88 -134,177 -201,266 -44,-34 -89,-67 -133,-101 15,-20 30,-40 46,-61z"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 60"
        x="0"
        y="0"
        style={{
          width: "1.4em",
          height: "auto",
        }}
      >
        <title>Copy</title>
        <path
          fill="currentColor"
          d="M36.29,17.09H30.91V11.71a.77.77,0,0,0-.77-.77H11.71a.78.78,0,0,0-.77.77V30.14a.77.77,0,0,0,.77.77h5.38v5.38a.77.77,0,0,0,.77.77H36.29a.78.78,0,0,0,.77-.77V17.86A.77.77,0,0,0,36.29,17.09ZM14,27.84V14H27.84V27.84ZM34,34H20.16V30.91h10a.76.76,0,0,0,.77-.77v-10H34Z"
        />
      </svg>
    </button>
  );
}
