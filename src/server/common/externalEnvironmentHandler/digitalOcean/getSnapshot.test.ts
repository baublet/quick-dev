import orderBy from "lodash.orderby";

it("sorts snapshots by created date", () => {
  const things = [
    { created_at: "2020-02-01", id: 1 },
    { created_at: "2019-01-01", id: 2 },
    { created_at: "2019-03-12", id: 3 },
  ];
  expect(orderBy(things, ["created_at"], ["desc"])).toEqual([
    { created_at: "2020-02-01", id: 1 },
    { created_at: "2019-03-12", id: 3 },
    { created_at: "2019-01-01", id: 2 },
  ]);
});
