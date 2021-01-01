import React from "react";

interface LeftNavigationLayoutProps {
  navigation: React.ReactElement;
  content: React.ReactElement;
}

export function LeftNavigationLayout({
  navigation,
  content,
}: LeftNavigationLayoutProps) {
  return (
    <div className="flex">
      <div className="order-1 w-3/4">{content}</div>
      <div className="order-0 mr-4 w-1/4">{navigation}</div>
    </div>
  );
}
