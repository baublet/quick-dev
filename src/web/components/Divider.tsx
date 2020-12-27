import React from "react";
import cx from "classnames";

export function Divider(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHRElement>,
    HTMLHRElement
  >
) {
  return <hr {...props} className={cx("my-5", props.className)} />;
}
