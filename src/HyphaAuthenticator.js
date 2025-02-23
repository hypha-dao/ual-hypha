import { Authenticator, UALErrorType } from "universal-authenticator-library";
import { UALHyphaWalletError } from "./UALHyphaWalletError.js";
import WebTransportLink from "./web-transport/index.js";
import ESRUtil from "./utils/esr.js";

import {
  AUTHENTICATOR_NAME,
  BUTTON_BACKGROUND_COLOR,
  BUTTON_TEXT_COLOR,
} from "../config/index.js";
import { HyphaLogo } from "./assets/HyphaLogo.js";
import { HyphaUser } from "./HyphaUser.js";

import { randomNumber } from "./utils/index.js";
import { ACCOUNT_LOGIN, generateAuthenticateAction } from "./actions/index.js";

/**
 * HyphaAuthenticator is a UAL (Universal Authenticator Library) implementation for Hypha wallet integration.
 *
 * @param {Array} chains - An array of chain configurations for UAL (Universal Authenticator Library).
 * @param {Object} options - An options object to customize behavior.
 * @param {string} [options.authenticatorName=AUTHENTICATOR_NAME] - The name of the authenticator. Defaults to a predefined constant `AUTHENTICATOR_NAME` if not provided.
 * @param {string} [options.loginContract=ACCOUNT_LOGIN] - The contract to be used for login functionality. Defaults to `ACCOUNT_LOGIN`.
 * @param {Object} [options.client] - Optional EOSIO client object for interacting with the blockchain. If not provided, the default client from `ESRUtil` will be used.
 * @param {Object} [options.rpc] - Optional EOSIO RPC endpoint for making network requests. If not provided, the default RPC from `ESRUtil` will be used.
 * @param {number} [options.transactionCheckInterval] - Interval (in ms) at which to check the status of blockchain transactions.
 * @param {number} [options.transactionCheckTimeout] - Timeout (in ms) for transaction checking operations.
 * @param {number} [options.pollingInterval] - Interval (in ms) for polling blockchain updates.
 * @param {number} [options.pollTimeout] - Timeout (in ms) for polling operations.
 */
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
    this.authenticatorName = options.authenticatorName || AUTHENTICATOR_NAME;
    this.loginContract = options.loginContract || ACCOUNT_LOGIN;

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
    this.transport = new WebTransportLink(esrUtil, {
      transactionCheckInterval: options.transactionCheckInterval,
      transactionCheckTimeout: options.transactionCheckTimeout,
      pollingInterval: options.pollingInterval,
      pollTimeout: options.pollTimeout
    });
  }
  /**
   * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
   */
  async init() {
    const session = await this.transport.restore(this.loginContract);
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
   * We return undefined - we do not want people to download the wallet other than with an onboarding link
   */
  getOnboardingLink() {
    return undefined;
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
    return this.authenticatorName;
  }

  /**
   * Returns the style of the Button that will be rendered.
   */
  getStyle() {
    return {
      icon: HyphaLogo,
      text: this.authenticatorName,
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
   * @param loginContent  Options object with text content to display during login
   */
  async login(loginContent = {}) {
    try {
      const loginCode = randomNumber();
      const action = generateAuthenticateAction({
        loginCode,
        loginContract: this.loginContract,
      });

      if (this.users.length === 0) {
        const accountName = await this.transport.login(
          action,
          loginCode,
          this.loginContract,
          loginContent
        );
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
  logout() {
    this.users = [];
    return this.transport.logout();
  }

  /**
   * Returns true if user confirmation is required for `getKeys`
   */
  requiresGetKeyConfirmation() {}
}
