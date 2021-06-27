import { QueryBuilder } from "../../common/db";

export interface Connection<T> {
  pageInfo: {
    totalCount: () => Promise<number>;
    hasPreviousPage: () => Promise<boolean>;
    hasNextPage: () => Promise<boolean>;
  };
  edges: () => Promise<
    {
      cursor: string;
      node: T;
    }[]
  >;
  _resultsQueryText: string;
}

export type Cursor = Record<string, ["asc" | "desc", any]>;

function flipDirection(dir: "asc" | "desc"): "asc" | "desc" {
  if (dir === "asc") return "desc";
  return "asc";
}

export async function buildConnectionResolver<T>(
  query: QueryBuilder,
  {
    first,
    after,
    before,
    last,
    sort = { id: "asc" } as Record<string | keyof T, "asc" | "desc">,
  }: {
    before?: string | null;
    last?: number | null;
    first?: number | null;
    after?: string | null;
    sort?: Record<string | keyof T, "asc" | "desc">;
  }
): Promise<Connection<T>> {
  const totalCountQuery = query.clone().clearSelect().count("id AS count");
  const resultSetQuery = query.clone();

  let cursor: Cursor = {};

  if (before) {
    cursor = deserializeCursor(before);
  }

  if (after) {
    cursor = deserializeCursor(after);
  }

  for (const [column, [sortDirection, value]] of Object.entries(cursor)) {
    if (before) {
      resultSetQuery.where(column, sortDirection === "desc" ? ">" : "<", value);
    } else {
      resultSetQuery.where(column, sortDirection === "desc" ? "<" : ">", value);
    }
  }

  for (const [key, direction] of Object.entries(sort)) {
    if (before) {
      resultSetQuery.orderBy(key, flipDirection(direction));
    } else {
      resultSetQuery.orderBy(key, direction);
    }
  }

  if (last) {
    resultSetQuery.limit(last);
  }
  if (first) {
    resultSetQuery.limit(first);
  }

  let totalCount: Promise<number>;
  const totalCountFn = () => {
    if (!totalCount) {
      totalCount = new Promise<number>(async (resolve) => {
        const count = await totalCountQuery;
        resolve(count[0].count);
      });
    }
    return totalCount;
  };

  let hasNextPage: Promise<boolean>;
  const hasNextPageFn = () => {
    if (!hasNextPage) {
      hasNextPage = new Promise<boolean>(async (resolve) => {
        resolve(false);
      });
    }
    return hasNextPage;
  };

  let hasPreviousPage: Promise<boolean>;
  const hasPreviousPageFn = () => {
    if (!hasPreviousPage) {
      hasPreviousPage = new Promise<boolean>(async (resolve) => {
        resolve(false);
      });
    }
    return hasPreviousPage;
  };

  let edges: Promise<
    {
      cursor: string;
      node: T;
    }[]
  >;
  const edgesFn = () => {
    if (!edges) {
      edges = new Promise<
        {
          cursor: string;
          node: T;
        }[]
      >(async (resolve) => {
        const edges: {
          cursor: string;
          node: T;
        }[] = [];

        const results = await resultSetQuery;
        for (const result of results) {
          edges.push({
            cursor: serializeCursor(result, sort),
            node: result,
          });
        }

        resolve(edges);
      });
    }
    return edges;
  };

  return {
    pageInfo: {
      totalCount: totalCountFn,
      hasNextPage: hasNextPageFn,
      hasPreviousPage: hasPreviousPageFn,
    },
    edges: edgesFn,
    _resultsQueryText: resultSetQuery.toQuery(),
  };
}

function deserializeCursor(cursorString: string): Cursor {
  try {
    const cursorResults: Cursor = JSON.parse(
      Buffer.from(cursorString, "base64").toString("utf-8")
    );
    return cursorResults;
  } catch (e) {
    throw new InvalidCursorError(cursorString);
  }
}

function serializeCursor(
  entity: Record<string, any>,
  sortFields: Record<string, "asc" | "desc">
): string {
  const cursor: Cursor = {};
  for (const [column, direction] of Object.entries(sortFields)) {
    cursor[column] = [direction, entity[column]];
  }
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

class InvalidCursorError extends Error {
  constructor(cursor: string, message?: string) {
    super(
      `Invalid cursor! Expect cursor to deserialize into an object. ${cursor}${
        message ?? `\n\n${message}`
      }`
    );
  }
}
