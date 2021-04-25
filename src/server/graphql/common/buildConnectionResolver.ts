import { QueryBuilder } from "../../common/db";

export interface Connection<T> {
  pageInfo: {
    totalCount: () => Promise<number>;
    hasPreviousPage: () => boolean | Promise<boolean>;
    hasNextPage: () => boolean | Promise<boolean>;
  };
  edges: () => Promise<
    {
      cursor: string;
      node: T;
    }[]
  >;
}

export function buildConnectionResolver<T>(
  query: QueryBuilder,
  {
    first,
    after,
    sort,
  }: {
    first: number;
    after?: string | null;
    sort?: (queryBuilder: QueryBuilder<T>) => any;
  }
): Connection<T> {
  const offset = after ? cursorToOffset(after) : 0;
  const totalCount = query.clone().countDistinct("id");
  const resultSet: Promise<Record<string, any>[]> = query
    .clone()
    .limit(first + 1)
    .offset(offset);

  if (sort) sort(resultSet as QueryBuilder);

  return {
    pageInfo: {
      totalCount: async () => {
        const resolvedCount = (await totalCount)[0].count;
        return resolvedCount;
      },
      hasPreviousPage: () => (offset === 0 ? false : true),
      hasNextPage: async () => {
        const resolvedCount = (await totalCount)[0].count;
        if (resolvedCount - offset - first > 0) {
          return true;
        }
        return false;
      },
    },
    edges: async () => {
      const resolvedSet = await resultSet;
      return resolvedSet.map((subject, index) => {
        return {
          cursor: offsetToCursor(offset + index),
          node: subject as T,
        };
      });
    },
  };
}

const PREFIX = "simple-cursor-";

function cursorToOffset(cursor?: string): number {
  if (cursor === undefined) {
    return 0;
  }
  const offsetString = cursor.substr(0, PREFIX.length);
  return parseInt(offsetString, 10);
}

function offsetToCursor(offset: number = 0): string {
  return `${PREFIX}${offset}`;
}
