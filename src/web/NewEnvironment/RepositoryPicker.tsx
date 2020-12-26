import React from "react";

import { useCurrentUserGitHubRepos } from "../useCurrentUserGitHubRepos";

export function RepositoryPicker() {
  const [page, setPage] = React.useState(1);
  const {
    loading,
    repositories,
    hasNextPage,
    hasPreviousPage,
  } = useCurrentUserGitHubRepos(page);

  if (loading) {
    return null;
  }

  return (
    <div>
      <h4>GitHub</h4>
      <ul>
        {repositories.map((repo) => (
          <li>{repo.name}</li>
        ))}
      </ul>
      <div>
        {!hasPreviousPage ? null : (
          <button onClick={() => setPage(page - 1)}>Prev</button>
        )}
        {!hasNextPage ? null : (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>
    </div>
  );
}
