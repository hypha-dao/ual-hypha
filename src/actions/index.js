export const ACCOUNT_LOGIN = "eosio.login";
export const TABLE_LOGIN = "logins";
export const ACTION_LOGIN = "loginuser";

export const generateAuthenticateAction = function ({
  loginCode,
  actor = "............1",
  permission = "............2",
}) {
  return [
    {
      account: ACCOUNT_LOGIN,
      name: ACTION_LOGIN,
      authorization: [
        {
          actor,
          permission,
        },
      ],
      data: {
        account_name: actor,
        login_code: loginCode,
      },
    },
  ];
};
