export type UserAccountSource = "github";

interface RawUserData {
  [k: string]:
    | string
    | boolean
    | number
    | (string | boolean | number)
    | RawUserData
    | RawUserData[];
}

export interface UserAccount {
  id: string;
  userId: string;
  source: UserAccountSource;
  uniqueIdentifier: string;
  rawUserData: RawUserData;
  created_at: Date;
  updated_at: Date;
}

export { create } from "./create";
export { getFullUserRecord } from "./getFullUserRecord";
