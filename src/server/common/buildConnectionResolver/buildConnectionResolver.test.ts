import { getTestConnection, destroyTestConnection } from "../db";

import { buildConnectionResolver } from "./buildConnectionResolver";

type User = {
  id: number;
  age: number;
  name: string;
};

beforeAll(async () => {
  const db = await getTestConnection();
  await db.schema.createTable("users", function (table) {
    table.increments("id");
    table.integer("age").notNullable();
    table.string("name", 255).notNullable();
  });

  function createUser(data: { age: number; name: string }) {
    return db.table("users").insert(data);
  }

  const fixtures: [string, number][] = [
    ["Amy", 26],
    ["Ben", 25],
    ["Claire", 24],
    ["Danielle", 23],
    ["Earl", 22],
    ["Francis", 21],
    ["Gus", 20],
    ["Hillary", 19],
    ["Inez", 18],
    ["James", 17],
    ["Katy", 16],
    ["Lana", 15],
    ["Moana", 14],
    ["Nina", 13],
    ["Owen", 12],
    ["Penelope", 11],
    ["Quaid", 10],
    ["Ryan", 9],
    ["Sylvia", 8],
    ["Tanya", 7],
    ["Ulrich", 6],
    ["Violet", 5],
    ["William", 4],
    ["Xander", 3],
    ["Yvonne", 2],
    ["Zebulon", 1],
  ];

  for (const [name, age] of fixtures) {
    await createUser({ name, age });
  }
});

afterAll(destroyTestConnection);

it("doesn't blow up", async () => {
  const db = await getTestConnection();
  await expect(
    buildConnectionResolver(db.table("users"), {
      first: 10,
    })
  ).resolves.toEqual(expect.anything());
});

it("returns the total count", async () => {
  const db = await getTestConnection();
  const connection = await buildConnectionResolver(db.table("users"), {
    first: 10,
  });
  await expect(connection.pageInfo.totalCount()).resolves.toEqual(26);
  await expect(connection.pageInfo.totalCount()).resolves.not.toEqual(20);
});

describe("Basic sort by ID", () => {
  it("returns proper results: first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` order by `id` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJpZCI6WyJhc2MiLDFdfQ==",
        node: { age: 26, id: 1, name: "Amy" },
      },
      {
        cursor: "eyJpZCI6WyJhc2MiLDJdfQ==",
        node: { age: 25, id: 2, name: "Ben" },
      },
      {
        cursor: "eyJpZCI6WyJhc2MiLDNdfQ==",
        node: { age: 24, id: 3, name: "Claire" },
      },
    ]);
  });

  it("returns proper results: next 3 after the first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
      after: "eyJpZCI6WyJhc2MiLDNdfQ==",
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` where `id` > 3 order by `id` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJpZCI6WyJhc2MiLDRdfQ==",
        node: { age: 23, id: 4, name: "Danielle" },
      },
      {
        cursor: "eyJpZCI6WyJhc2MiLDVdfQ==",
        node: { age: 22, id: 5, name: "Earl" },
      },
      {
        cursor: "eyJpZCI6WyJhc2MiLDZdfQ==",
        node: { age: 21, id: 6, name: "Francis" },
      },
    ]);
  });
});

describe("Multiple field sort", () => {
  it("returns proper results: first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver<User>(db.table("users"), {
      first: 3,
      sort: {
        age: "desc",
        name: "asc",
      },
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` order by `age` desc, `name` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJhZ2UiOlsiZGVzYyIsMjZdLCJuYW1lIjpbImFzYyIsIkFteSJdfQ==",
        node: { age: 26, id: 1, name: "Amy" },
      },
      {
        cursor: "eyJhZ2UiOlsiZGVzYyIsMjVdLCJuYW1lIjpbImFzYyIsIkJlbiJdfQ==",
        node: { age: 25, id: 2, name: "Ben" },
      },
      {
        cursor: "eyJhZ2UiOlsiZGVzYyIsMjRdLCJuYW1lIjpbImFzYyIsIkNsYWlyZSJdfQ==",
        node: { age: 24, id: 3, name: "Claire" },
      },
    ]);
  });

  it("returns proper results: next 3 after the first 3", async () => {
    const db = await getTestConnection();
    const connection = await buildConnectionResolver(db.table("users"), {
      first: 3,
      after: "eyJhZ2UiOlsiZGVzYyIsMjRdLCJuYW1lIjpbImFzYyIsIkNsYWlyZSJdfQ==",
      sort: {
        age: "desc",
        name: "asc",
      },
    });

    expect(connection._resultsQueryText).toEqual(
      "select * from `users` where `age` < 24 and `name` > 'Claire' order by `age` desc, `name` asc limit 3"
    );
    await expect(connection.edges()).resolves.toEqual([
      {
        cursor: "eyJhZ2UiOlsiZGVzYyIsMjNdLCJuYW1lIjpbImFzYyIsIkRhbmllbGxlIl19",
        node: { age: 23, id: 4, name: "Danielle" },
      },
      {
        cursor: "eyJhZ2UiOlsiZGVzYyIsMjJdLCJuYW1lIjpbImFzYyIsIkVhcmwiXX0=",
        node: { age: 22, id: 5, name: "Earl" },
      },
      {
        cursor: "eyJhZ2UiOlsiZGVzYyIsMjFdLCJuYW1lIjpbImFzYyIsIkZyYW5jaXMiXX0=",
        node: { age: 21, id: 6, name: "Francis" },
      },
    ]);
  });
});
