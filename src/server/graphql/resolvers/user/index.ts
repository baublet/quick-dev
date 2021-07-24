import { userAccount } from "../../../common/entities";
import { Context } from "../../../common/context";
import { User } from "../../generated";

export function user(
  _parent: unknown,
  args: unknown,
  context: Context
): Pick<User, "id" | "name" | "email" | "avatarUrl"> {
  const user = context.getUserOrFail();
  const accountWithAvatar = user.userAccounts.find(
    (user) => user.rawUserData.avatar
  );
  let avatarUrl = null;

  if (accountWithAvatar) {
    avatarUrl = accountWithAvatar.rawUserData.avatar;
  }

  return {
    id: user.user.id,
    avatarUrl,
    email: userAccount.getEmailFromUserAccountRecordsOrThrow(user.userAccounts),
    name: userAccount.getNameFromUserAccountRecordsOrThrow(user.userAccounts),
  };
}
