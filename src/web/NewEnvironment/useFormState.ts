import React from "react";
import { useHistory } from "react-router-dom";

import type { Repository } from "../../server/graphql/generated";
import type { EnvironmentSize } from "../../server/common/entities";
import { useCreateEnvironmentMutation } from "../generated";

export function useFormState() {
  const [repository, setRepository] = React.useState<Repository>();
  const [environmentSize, setEnvironmentSize] = React.useState<EnvironmentSize>(
    "s"
  );
  const [size, setSize] = React.useState<EnvironmentSize>("s");
  const { push } = useHistory();
  const [saving, setSaving] = React.useState(false);

  const [createEnvironment] = useCreateEnvironmentMutation();

  const save = async (): Promise<void> => {
    if (!repository) {
      return;
    }
    return new Promise<void>(async (resolve) => {
      setSaving(true);
      createEnvironment({
        variables: {
          repo: repository.gitUrl,
        },
      })
        .then((response) => {
          const newEnvironmentId =
            response.data?.createEnvironment.environment?.id;
          if (!newEnvironmentId) {
            console.log("No error, but no environment ID in response?", {
              responseData: response.data,
            });
            setSaving(false);
            return;
          }
          push(`/environment/${newEnvironmentId}`);
        })
        .catch((error) => {
          console.error({ error });
          setSaving(false);
        })
        .finally(() => {
          resolve();
        });
    });
  };

  return {
    environmentSize,
    setEnvironmentSize,
    repository,
    save,
    setRepository,
    saving,
    setSaving,
    size,
    setSize,
  };
}

export type FormState = ReturnType<typeof useFormState>;
