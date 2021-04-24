import { GitHubUser } from "../../gitHub";

export type UserAccountSource = "github";

type RawUserData = GitHubUser;

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
export { getEmailFromUserAccountRecordsOrThrow } from "./getEmailFromUserAccountRecordsOrThrow";
