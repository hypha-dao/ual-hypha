import { UALError } from "universal-authenticator-library";

export class UALHyphaWalletError extends UALError {
  constructor(message, type, cause) {
    super(message, type, cause, "HyphaWallet");
  }
}
