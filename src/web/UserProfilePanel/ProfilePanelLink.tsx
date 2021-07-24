import React from "react";
import { Link as RRLink, LinkProps } from "react-router-dom";
import cx from "classnames";

interface StrapYardLinkProps extends LinkProps {
  external?: boolean;
  to: string;
}

export function ProfilePanelLink({ external, ...props }: StrapYardLinkProps) {
  const className = cx(
    "text-blue-100 hover:underline hover:text-white",
    props.className
  );
  if (external) {
    return <a {...props} href={props.to} className={className} />;
  }
  return <RRLink {...props} className={className} />;
}
