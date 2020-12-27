import React from "react";
import cx from "classnames";

export function H1(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h1 {...props} className={cx("tracking-tighter font-bold text-3xl", props.className)} />
  );
}
