import React from "react";
import { Link as RRLink, LinkProps } from "react-router-dom";
import cx from "classnames";

export function Link(props: LinkProps) {
  return (
    <RRLink
      {...props}
      className={cx("text-blue-600 hover:underline", props.className)}
    />
  );
}
