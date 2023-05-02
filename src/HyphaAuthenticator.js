import { Authenticator, UALErrorType } from "universal-authenticator-library";
import { UALHyphaWalletError } from "./UALHyphaWalletError.js";
import WebTransportLink from "./web-transport/index.js";
import ESRUtil from "./utils/esr.js";

import {
  ONBOARDING_LINK,
  AUTHENTICATOR_NAME,
  BUTTON_BACKGROUND_COLOR,
  BUTTON_TEXT_COLOR,
} from "../config/index.js";
import { Logo } from "./logo.js";
import { HyphaUser } from "./HyphaUser.js";

import { randomNumber } from "./utils/index.js";
import { generateAuthenticateAction } from "./actions/index.js";

export class HyphaAuthenticator extends Authenticator {
  constructor(chains, options) {
    super(chains);
    // Establish initial values
    this.chainId = chains[0].chainId;
    this.users = [];
    // Determine the default rpc endpoint for this chain
    const [chain] = chains;
    const [rpc] = chain.rpcEndpoints;
    const url = `${rpc.protocol}://${rpc.host}:${rpc.port}`;
    const esrUtil = new ESRUtil(url);
    this.esrUtil = esrUtil;

    if (options && options.client) {
      this.client = options.client;
    } else {
      this.client = this.esrUtil.api;
    }
    if (options && options.rpc) {
      this.rpc = options.rpc;
    } else {
      this.rpc = this.esrUtil.rpc;
    }
    this.transport = new WebTransportLink(esrUtil);
  }
  /**
   * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
   */
  async init() {
    const session = await this.transport.restore();
    if (session) {
      this.users = [new HyphaUser(this.transport, session)];
    }
  }

  /**
   * Resets the authenticator to its initial, default state then calls `init` method
   */
  reset() {}

  /**
   * Returns true if the authenticator has errored while initializing.
   */
  isErrored() {}

  /**
   * Returns a URL where the user can download and install the underlying authenticator
   * if it is not found by the UAL Authenticator.
   */
  getOnboardingLink() {
    return ONBOARDING_LINK;
  }

  /**
   * Returns error (if available) if the authenticator has errored while initializing.
   */
  getError() {}

  /**
   * Returns true if the authenticator is loading while initializing its internal state.
   */
  isLoading() {
    return false;
  }

  /**
   * Returns name of authenticator
   */
  getName() {
    return AUTHENTICATOR_NAME;
  }

  /**
   * Returns the style of the Button that will be rendered.
   */
  getStyle() {
    return {
      icon: Logo,
      text: AUTHENTICATOR_NAME,
      textColor: BUTTON_TEXT_COLOR,
      background: BUTTON_BACKGROUND_COLOR,
    };
  }

  /**
   * Returns whether or not the button should render based on the operating environment and other factors.
   * ie. If your Authenticator App does not support mobile, it returns false when running in a mobile browser.
   */
  shouldRender() {
    return !this.isLoading();
  }

  /**
   * Returns whether or not the dapp should attempt to auto login with the Authenticator app.
   * Auto login will only occur when there is only one Authenticator that returns shouldRender() true and
   * shouldAutoLogin() true.
   */
  shouldAutoLogin() {
    return false;
  }

  /**
   * Returns whether or not the button should show an account name input field.
   * This is for Authenticators that do not have a concept of account names.
   */
  async shouldRequestAccountName() {
    return false;
  }

  /**
   * Login using the Authenticator App. This can return one or more users depending on multiple chain support.
   *
   * @param accountName  The account name of the user for Authenticators that do not store accounts (optional)
   */
  async login() {
    try {
      const loginCode = randomNumber();
      const action = generateAuthenticateAction({ loginCode });

      console.log("USERS: ", this.users);
      if (this.users.length === 0) {
        console.log("ACTION CODE: ", action, loginCode);
        const accountName = await this.transport.login(action, loginCode);
        console.log("TRANSACTION INFO accountName: ", accountName);
        if (accountName) {
          this.users = [new HyphaUser(this.transport, accountName)];
        } else {
          throw new UALHyphaWalletError(
            "Transaction hasn't been signed on time, please try again",
            UALErrorType.Login,
            "timeout"
          );
        }
      } else {
      }
    } catch (e) {
      throw new UALHyphaWalletError(e.message, UALErrorType.Login, e);
    }
    return this.users;
  }

  /**
   * Logs the user out of the dapp. This will be strongly dependent on each Authenticator app's patterns.
   */
  async logout() {}

  /**
   * Returns true if user confirmation is required for `getKeys`
   */
  requiresGetKeyConfirmation() {}
}
