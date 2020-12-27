import {
  get,
  getEnvironmentCount,
  Environment,
} from "../../../common/environment";
import { Context } from "../../../common/context";

interface Args {
  input?: {
    perPage?: number;
    page?: number;
  };
}

const defaultArgs: Args = { input: {} };

export async function environments(
  _parent: Context["user"],
  { input }: Args = defaultArgs,
  context: Context
): Promise<{
  totalCount?: () => Promise<number>;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nodes: Environment[];
}> {
  const perPage = input?.perPage || 25;
  const currentPage = input?.page || 1;

  const environments = await get(context.db, {
    user: context.user.email,
    page: currentPage,
    perPage: perPage + 1,
  });

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = environments.length > perPage;

  if (hasNextPage) {
    environments.pop();
  }

  return {
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nodes: environments,
    totalCount: () =>
      getEnvironmentCount(context.db, { user: context.user.email }),
  };
}
