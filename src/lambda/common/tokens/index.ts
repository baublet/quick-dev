export interface Token {
  id: number;
  token: string;
  created_at: Date;
  updated_at: Date;
  expires: Date;
  used: boolean;
}

export { consume } from "./consume";
export { create } from "./create";
