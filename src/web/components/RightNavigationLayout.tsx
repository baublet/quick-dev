import React from "react";

interface LeftNavigationLayoutProps {
  navigation: React.ReactElement<any, any> | null;
  content: React.ReactElement<any, any> | null;
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
