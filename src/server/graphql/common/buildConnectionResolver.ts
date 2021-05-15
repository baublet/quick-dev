import { log } from "../../../common/logger";

import { QueryBuilder, getDatabaseConnection } from "../../common/db";

const sortDirections = ["asc", "desc"];

export interface Connection<T> {
  pageInfo: {
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  edges: {
    cursor: string;
    node: T;
  }[];
}

interface Cursor {
  entity: Record<string, "asc" | "desc">;
  sort: Record<string, "asc" | "desc">[];
}

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
  const totalCount = query.clone().clearSelect().count("*");

  const rawSortOptions = Object.entries(sort)
    .map(
      ([key, direction]) =>
        `${key} ${last ? flipDirection(direction) : direction}`
    )
    .join(",");
  const fullResultSetSubQuery = query
    .clone()
    .clearSelect()
    .select(db.raw(`id, ROW_NUMBER() OVER (ORDER BY ${rawSortOptions}`));

  Object.entries(sort).forEach(([key, direction]) => {
    fullResultSetSubQuery.orderBy(key, direction);
  });

  const slicedResultSet = query.clone();

  return null;
}

function deserializeCursor(cursorString: string): Cursor {
  try {
    const cursorResults = JSON.parse(
      Buffer.from(cursorString, "base64").toString("utf-8")
    );
    if (typeof cursorResults !== "object") {
      throw new InvalidCursorError(
        cursorString,
        `Cursor is invalid type: ${typeof cursorResults}`
      );
    }

    if (!("entity" in cursorResults)) {
      throw new InvalidCursorError(
        cursorString,
        "Cursors must include referenced entity"
      );
    }

    if (!("sort" in cursorResults)) {
      throw new InvalidCursorError(
        cursorString,
        "Cursors must specify sort data"
      );
    }

    const entity: Record<string, "asc" | "desc"> =
      "entity" in cursorResults ? cursorResults.entity : {};
    const sort: Record<string, "asc" | "desc">[] =
      "sort" in cursorResults ? cursorResults.sort : [{ id: "asc" }];

    for (const sortField of sort) {
      if (Object.keys(sortField).length !== 1) {
        throw new InvalidCursorError(
          cursorString,
          `Sort directions may only specify a single key/value pair per specification: ${JSON.stringify(
            sortField
          )}`
        );
      }
      const fieldKey = Object.values(sortField)[0];
      const fieldDirection = Object.keys(sortField)[0];

      if (!sortDirections.includes(fieldDirection)) {
        throw new InvalidCursorError(
          cursorString,
          `Sort key specified an invalid sort direction: ${fieldDirection}`
        );
      }

      if (!(fieldKey in entity)) {
        throw new InvalidCursorError(
          cursorString,
          `Valid cursors require entity fields on the target entity to exist when specified as a sort key. Field ${fieldKey} does not exist on entity ${JSON.stringify(
            entity
          )}`
        );
      }
    }

    return {
      sort,
      entity,
    };
  } catch (e) {
    throw new InvalidCursorError(cursorString);
  }
}

function serializeCursor(
  entity: Record<string, any>,
  sortFields: Record<string, "asc" | "desc">[]
): string {
  const fieldsToKeep = sortFields.reduce((fields, field) => {
    fields.push(Object.keys(field)[0]);
    return fields;
  }, [] as string[]);
  const newEntity: Record<string, any> = {};
  for (const field of fieldsToKeep) {
    newEntity[field] = entity[field];
  }
  return Buffer.from(
    JSON.stringify({
      sortFields,
      entity: newEntity,
    }),
    "utf-8"
  ).toString("base64");
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
