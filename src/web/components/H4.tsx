import React from "react";
import cx from "classnames";

export function H4(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h4
      {...props}
      className={cx("font-bold text-lg leading-5", props.className)}
    />
  );
}
