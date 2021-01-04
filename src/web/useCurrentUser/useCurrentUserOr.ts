import { useHistory } from "react-router-dom";

import { useCurrentUser } from "./useCurrentUser";

export function useCurrentUserOr(
  or: "throwUnauthorized" | "redirect" = "throwUnauthorized"
) {
  const { loading, user } = useCurrentUser();
  const { push } = useHistory();

  if (loading) {
    return null;
  }

  if (!user) {
    switch (or) {
      case "redirect":
        push("/login");
        return null;
      case "throwUnauthorized":
        throw new Error("Unauthorized");
      default:
        return null;
    }
  }

  return user;
}
