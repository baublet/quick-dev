export interface Token {
  id: string;
  token: string;
  created_at: Date;
  updated_at: Date;
  expires: Date;
  used: boolean;
}

export { consume } from "./consume";
export { create } from "./create";
