import React from "react";
import cx from "classnames";

export function H3(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h3 {...props} className={cx("font-bold text-xl", props.className)} />
  );
}
