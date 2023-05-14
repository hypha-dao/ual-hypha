/**
 * @jest-environment jsdom
 */

import ESRUtil from "./esr";
import fetch from "node-fetch";
const esrUtil = new ESRUtil(undefined, fetch);
const TEST_ESR =
  "esr://gmNgYmBYlmzC9MoglIFhB9frlxK9jIwMEMAEpQVgAuyWBhaGZoamjOoZJSUFxVb6-ln5mXnFqakpxXqpiUUlGfolRYl5xYnJJZn5efqGRsYMAA";
const TEST_ACTION = [
  {
    account: "eosio.login",
    name: "loginuser",
    authorization: [
      {
        actor: "............1",
        permission: "............2",
      },
    ],
    data: {
      account_name: "............1",
      login_code: 9081615,
    },
  },
];

test("Decoded ESR returns appropriate action", async () => {
  const decodedESR = await esrUtil.decodeESR(TEST_ESR);
  expect(decodedESR.data).toBeTruthy();
});

test("Encode action into ESR", async () => {
  const encodedESR = await esrUtil.encodeESR(
    TEST_ACTION,
    "https://hypha.earth/transaction/123"
  );
  expect(encodedESR).toBeTruthy();
});
