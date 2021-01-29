import faker from "faker";

export function createHumanReadableId() {
  return `${faker.random.word()}-${faker.random.word()}-${faker.random.number()}`.toLowerCase();
}
