import { userAccount } from "../../../common/entities";
import { Context } from "../../../common/context";
import { User } from "../../generated";

export function user(
  _parent: unknown,
  args: unknown,
  context: Context
): Pick<User, "id" | "name" | "email"> {
  const user = context.getUserOrFail();
  return {
    id: user.user.id,
    email: userAccount.getEmailFromUserAccountRecordsOrThrow(user.userAccounts),
    name: userAccount.getNameFromUserAccountRecordsOrThrow(user.userAccounts),
  };
}
