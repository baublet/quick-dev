import React from "react";

import { LogEntryProps } from ".";
import { StatusIndicator } from "../../../components/StatusIndicator";

const baseClassNames =
  "shadow-sm block p-4 border rounded-sm border-gray-400 text-gray-800 leading-5";

export function LogEntryWaiting({ status, title }: LogEntryProps) {
  return (
    <div className="mt-4">
      <div className={baseClassNames}>
        <div className="inline-block mr-4">
          <StatusIndicator status="none" alt="waiting" />
        </div>
        <span>{title}</span>
      </div>
    </div>
  );
}
