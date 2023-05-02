import { User, UALErrorType } from "universal-authenticator-library";

import { UALHyphaWalletError } from "./UALHyphaWalletError.js";

export class HyphaUser extends User {
  constructor(transport, accountName) {
    super();
    this.transport = transport;
    this.accountName = accountName;
    this.rpc = transport.rpc;
  }

  async init() {}

  async signTransaction(transaction, options) {
    try {
      return this.transport.signTransaction(transaction, options);
    } catch (e) {
      const message = e.message ? e.message : "Unable to sign transaction";
      const type = UALErrorType.Signing;
      const cause = e;
      throw new UALSeedsWalletError(message, type, cause);
    }
  }

  async signArbitrary() {
    throw new UALSeedsWalletError(
      `${Name} does not currently support signArbitrary`,
      UALErrorType.Unsupported,
      null
    );
  }

  async verifyKeyOwnership() {
    throw new UALSeedsWalletError(
      `${Name} does not currently support verifyKeyOwnership`,
      UALErrorType.Unsupported,
      null
    );
  }

  async getAccountName() {
    return this.accountName;
  }

  async getChainId() {
    return this.chain.chainId;
  }

  async isAccountValid() {
    try {
      const account =
        this.transport.esrUtil.rpc &&
        (await this.transport.esrUtil.rpc.get_account(this.accountName));

      const actualKeys = this.extractAccountKeys(account);

      return actualKeys.length > 0;
    } catch (e) {
      if (e.constructor.name === "UALSeedsWalletError") {
        throw e;
      }

      const message = `Account validation failed for account ${this.accountName}.`;
      const type = UALErrorType.Validation;
      const cause = e;
      throw new UALSeedsWalletError(message, type, cause);
    }
  }

  extractAccountKeys(account) {
    const keySubsets = account.permissions.map((permission) =>
      permission.required_auth.keys.map((key) => key.key)
    );
    let keys = [];
    for (const keySubset of keySubsets) {
      keys = keys.concat(keySubset);
    }
    return keys;
  }
}
