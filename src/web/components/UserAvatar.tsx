import React from "react";

import { Avatar } from "./svg/Avatar";

export function UserAvatar({
  avatarUrl,
  name,
}: {
  avatarUrl?: string | null;
  name?: string | null;
}) {
  return (
    <div
      style={{ width: 42, height: 42 }}
      className="rounded-full overflow-hidden"
    >
      {avatarUrl ? (
        <img src={avatarUrl} />
      ) : (
        <div style={{ transform: "translate(0, 5px)" }}>
          <Avatar />
        </div>
      )}
    </div>
  );
}
