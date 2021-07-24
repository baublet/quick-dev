import React from "react";
import cx from "classnames";

import { UserAvatar } from "../components/UserAvatar";
import { useCurrentUser } from "../useCurrentUser";
import { useOnClickOutside } from "../useOnClickOutside";
import { useAuth } from "../useAuth";
import { ProfilePanelLink } from "./ProfilePanelLink";

export function UserProfilePanel() {
  const { gitHubLink } = useAuth();
  const { loading, authenticated, user } = useCurrentUser();
  const [profilePanelOpen, setProfilePanelOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const profilePanelClassName = cx(
    {
      "opacity-0 pointer-events-none": !profilePanelOpen,
      "opacity-100 pointer-events-auto": profilePanelOpen,
    },
    "p-4 bg-gray-900 text-gray-50 absolute top-full right-0 w-72"
  );
  const icon = profilePanelOpen ? "▴" : "▾";

  useOnClickOutside(panelRef, () => {
    console.log("Click outside");
    setProfilePanelOpen(false);
  });

  if (loading) {
    return null;
  }

  console.log({ user });

  return (
    <div className="relative hover:bg-gray-100 rounded-lg" ref={panelRef}>
      <button
        className="flex items-center"
        onClick={() => setProfilePanelOpen(!profilePanelOpen)}
      >
        <div className="flex-grow">
          <UserAvatar avatarUrl={user?.avatarUrl} />
        </div>
        <div className="px-2">{icon}</div>
      </button>
      <div className={profilePanelClassName}>
        {user && <>{user.name}</>}
        {!authenticated ? (
          <ProfilePanelLink to={gitHubLink} external={true}>
            Sign in with GitHub
          </ProfilePanelLink>
        ) : (
          <ProfilePanelLink to="/logout" external={true}>
            Logout
          </ProfilePanelLink>
        )}
      </div>
    </div>
  );
}
