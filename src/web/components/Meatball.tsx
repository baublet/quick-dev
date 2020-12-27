import React from "react";
import cx from "classnames";

import { useOnClickOutside } from "../useOnClickOutside";
import { Meatball as MeatballIcon } from "./svg/Meatball";

export function Meatball({ children }: React.PropsWithChildren<{}>) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 w-8 h-8 flex justify-center items-center"
      >
        <div className="w-4">
          <MeatballIcon />
        </div>
      </button>
      <div className={cx("p-2 bg-white shadow-md absolute", { hidden: !open })}>
        {children}
      </div>
    </div>
  );
}
