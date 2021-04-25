import { ConnectionOrTransaction } from "../../common/db";

interface Connection<T> {
  pageInfo: {
    totalCount: () => Promise<number>;
    hasPreviousPage: () => Promise<boolean>;
    hasNextPage: () => Promise<boolean>;
  };
  edges: () => Promise<
    {
      cursor: string;
      node: T[];
    }[]
  >;
}

export function buildConnectionResolver<T>(
  db: ConnectionOrTransaction,
  args: {
    tableName: string;
    first: number;
    after?: string;
    sort: {
      key: keyof T;
      direction: "ASC" | "DESC";
    }[];
  }
): Promise<Connection<T>> {}

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
