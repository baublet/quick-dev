import React from "react";

interface LeftNavigationLayoutProps {
  navigation: React.ReactElement;
  content: React.ReactElement;
}

export function RightNavigationLayout({
  navigation,
  content,
}: LeftNavigationLayoutProps) {
  return (
    <div className="flex">
      <div className="w-3/4">{content}</div>
      <div className="ml-4 w-1/4">{navigation}</div>
    </div>
  );
}
