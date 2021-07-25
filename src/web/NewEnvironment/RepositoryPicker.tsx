import React from "react";

import { SmallListPaginationButton } from "../components/buttons/SmallListPaginationButton";
import { useCurrentUserGitHubRepos } from "../useCurrentUserGitHubRepos";
import { FormState } from "./useFormState";
import { H4 } from "../components/H4";
import { H5 } from "../components/H5";
import { Loader } from "../components/Loader";

export function RepositoryPicker({ formState }: { formState: FormState }) {
  const [page, setPage] = React.useState(1);
  const {
    loading,
    repositories,
    hasNextPage,
    hasPreviousPage,
    popular,
  } = useCurrentUserGitHubRepos(page);

  React.useEffect(() => {
    const mostPopular = popular[0];
    if (!formState.repository && mostPopular) {
      formState.setRepository(mostPopular);
    }
  }, [popular]);

  return (
    <>
      <H4 className="mt-2">GitHub</H4>
      <div className="flex mt-2">
        <div className="border border-gray-200 rounded-sm p-4 w-2/3 min-w-2/3">
          <Loader display={loading} />
          <ul className="space-y-1.5">
            {repositories.map((repo) => (
              <li key={repo.gitUrl}>
                <input
                  name="repo"
                  id={repo.gitUrl}
                  type="radio"
                  checked={formState.repository?.gitUrl === repo.gitUrl}
                  className="mr-2"
                />
                <label
                  className="cursor-pointer border-b-2 border-opacity-0 hover:border-opacity-100 border-blue-400"
                  htmlFor={repo.gitUrl}
                  onClick={() => formState.setRepository(repo)}
                >
                  {repo.name}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <div>
              {!hasPreviousPage ? null : (
                <SmallListPaginationButton onClick={() => setPage(page - 1)}>
                  Prev
                </SmallListPaginationButton>
              )}
            </div>
            <div>
              {!hasNextPage ? null : (
                <SmallListPaginationButton onClick={() => setPage(page + 1)}>
                  Next
                </SmallListPaginationButton>
              )}
            </div>
          </div>
        </div>
        {popular.length > 0 && (
          <div className="ml-4">
            <H5>Popular/Recent</H5>
            <ul className="space-y-1.5 mt-2">
              {popular.map((repo) => (
                <li key={repo.gitUrl}>
                  <input
                    name="repo"
                    id={repo.gitUrl}
                    type="radio"
                    checked={formState.repository?.gitUrl === repo.gitUrl}
                    className="mr-2"
                  />
                  <label
                    className="cursor-pointer border-b-2 border-opacity-0 hover:border-opacity-100 border-blue-400"
                    htmlFor={repo.gitUrl}
                    onClick={() => formState.setRepository(repo)}
                  >
                    {repo.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
