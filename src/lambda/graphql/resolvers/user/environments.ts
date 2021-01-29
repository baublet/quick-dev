import {
  environment as envEntity,
  Environment,
} from "../../../common/entities";
import { Context } from "../../../common/context";
import { unauthorized } from "../../common/unauthorized";
import { unauthorizedError } from "../../common/unauthorizedError";

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

  if (!unauthorized(context)) {
    throw unauthorizedError(context);
  }

  const environments = await envEntity.get(context.db, {
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
      envEntity.getEnvironmentCount(context.db, { user: context.user.email }),
  };
}
