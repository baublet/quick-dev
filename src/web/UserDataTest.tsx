import React from "react";

import { useCurrentUser } from "./useCurrentUser";

export function UserDataTest() {
  const { user } = useCurrentUser();

  return (
    <div>
      <textarea
        style={{
          width: "500px",
          height: "600px",
        }}
        value={JSON.stringify(user, undefined, 5)}
      />
    </div>
  );
}
