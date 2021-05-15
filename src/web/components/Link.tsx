import React from "react";
import { Link as RRLink, LinkProps } from "react-router-dom";
import cx from "classnames";

interface StrapYardLinkProps extends LinkProps {
  external?: boolean;
  to: string;
}

export function Link({ external, ...props }: StrapYardLinkProps) {
  const className = cx("text-blue-600 hover:underline", props.className);
  if (external) {
    return <a {...props} href={props.to} className={className} />;
  }
  return <RRLink {...props} className={className} />;
}
