import { log } from "../../../common/logger";

import { QueryBuilder, getDatabaseConnection } from "../../common/db";

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
}

type Cursor = Record<string, ["asc" | "desc", any]>;

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
  const db = getDatabaseConnection();
  const totalCountQuery = query.clone().clearSelect().count("id AS count");

  const resultSetQuery = query.clone().clearSelect().select();

  Object.entries(sort).forEach(([key, direction]) => {
    if (before) {
      resultSetQuery.orderBy(key, flipDirection(direction));
    } else {
      resultSetQuery.orderBy(key, direction);
    }
  });

  let cursor: Cursor = {};

  if (before) {
    cursor = deserializeCursor(before);
  }

  if (after) {
    cursor = deserializeCursor(after);
  }

  for (const [column, [sortDirection, value]] of Object.entries(cursor)) {
    if (before) {
      resultSetQuery.where(column, sortDirection === "asc" ? ">" : "<", value);
    } else {
      resultSetQuery.where(column, sortDirection === "asc" ? "<" : ">", value);
    }
  }

  if (last) {
    resultSetQuery.limit(last);
  }
  if (first) {
    resultSetQuery.limit(first);
  }

  const totalCount = new Promise<number>(async (resolve) => {
    const count = await totalCountQuery;
    resolve(count[0].count);
  });

  const hasNextPage = new Promise<boolean>(async (resolve) => {
    resolve(false);
  });

  const hasPreviousPage = new Promise<boolean>(async (resolve) => {
    resolve(false);
  });

  const edges = new Promise<
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

  return {
    pageInfo: {
      totalCount: () => totalCount,
      hasNextPage: () => hasNextPage,
      hasPreviousPage: () => hasPreviousPage,
    },
    edges: () => edges,
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
    cursor[column] = [entity[column], direction];
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
