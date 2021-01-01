import React from "react";
import { Link } from "react-router-dom";

interface NavigationLinkItem {
  name: string;
  to: string;
}

type NavigationListItem = NavigationLinkItem;

interface NavigationListProps {
  items: NavigationListItem[];
}

export function NavigationList({ items }: NavigationListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li>
          <Link to={item.to}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}
