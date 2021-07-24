export interface Repository {
  id: string;
  uses: number;
  name: string;
  htmlUrl: string;
  gitUrl: string;
  userId: string;
  updated_at: Date;
  created_at: Date;
  source: "github";
  sourceId: string;
  private: boolean;
}

export { getPopularRepositories } from "./getPopularRepositories";
export { upsertRepository } from "./upsertRepository";
