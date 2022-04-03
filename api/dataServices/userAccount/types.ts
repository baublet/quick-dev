export type UserAccountEntity = {
  id: string;
  source: "github";
  sourceData: Record<string, string | boolean | number>;
};
