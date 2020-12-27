import React from "react";
import cx from "classnames";

export function H2(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h2 {...props} className={cx("tracking-tight font-bold text-2xl", props.className)} />
  );
}
