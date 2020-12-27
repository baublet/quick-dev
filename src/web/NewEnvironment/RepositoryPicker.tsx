import React from "react";

import { SmallListPaginationButton } from "../components/buttons/SmallListPaginationButton";
import { useCurrentUserGitHubRepos } from "../useCurrentUserGitHubRepos";
import { FormState } from "./useFormState";
import { H4 } from "../components/H4";
import { Loader } from "../components/Loader";

export function RepositoryPicker({ formState }: { formState: FormState }) {
  const [page, setPage] = React.useState(1);
  const {
    loading,
    repositories,
    hasNextPage,
    hasPreviousPage,
  } = useCurrentUserGitHubRepos(page);

  return (
    <>
      <H4>GitHub</H4>
      <div className="border border-gray-200 rounded-sm p-4 max-w-md">
        <Loader display={loading} />
        <ul className="space-y-1.5">
          {repositories.map((repo) => (
            <li>
              <input
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
    </>
  );
}
