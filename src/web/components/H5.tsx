import React from "react";
import cx from "classnames";

export function H5(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  return (
    <h5 {...props} className={cx("font-bold leading-5", props.className)} />
  );
}
