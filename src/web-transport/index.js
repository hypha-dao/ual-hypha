import Dialog from "./ui/dialog.js";
import QRCode from "qrcode";
import { poll, getTransactionUID } from "../utils/index.js";
import { SEEDS_CALLBACK_HOST } from "../../config/index.js";
import { UALHyphaWalletError } from "../UALHyphaWalletError.js";

const StorageSessionKey = `UALStorageSessionKey`;

const checkLoginData = function (transaction, loginCode) {
  const actions = transaction.traces;
  const loginAction =
    actions &&
    actions
      .map((action) => action.act)
      .find((action) => action && action.account === "eosio.login");
  if (!loginAction) throw new Error("unauthorized");

  const { data } = loginAction;
  if (data.login_code != loginCode) throw new Error("wrong-login-code");
  return data.account_name;
};


class WebTransportLink {
  constructor(esrUtil, pollingInterval = 2000) {
    this.dialog = new Dialog();
    this.esrUtil = esrUtil;
    this.rpc = esrUtil.rpc;
    this.pollingInterval = pollingInterval;
    this.login = this.login.bind(this);
    this.restore = this.restore.bind(this);
    this.logout = this.logout.bind(this);
  }

  getContractFromTransaction(transactions) {
    return transactions && transactions.length > 0 && transactions[0].account;
  }

  async checkForConfirmation(uid) {
    const pollingUrl = `${SEEDS_CALLBACK_HOST}/transaction/${uid}`;

    try {
      const response = await fetch(pollingUrl);
      const status = response.status;
      if (Number(status) !== 200) return;
      const data = response.text();
      return data;
    } catch (e) {
      return;
    }
  }

  getDialog(options, qrCode, esr) {
    return {
      title: options.title || "Sign Transaction",
      subtitle:
        options.subtitle ||
        "Scan the QR-code with SEEDS Light Wallet on another device or use the button to open SEEDS Desktop Wallet on this device.",
      qrCode,
      action: {
        text: options.actionText || "Launch SEEDS Desktop",
        callback:
          options.actionCallback ||
          function () {
            window.open(esr, "_blank");
          },
      },
      footer: options.footerText || "THIS IS A TEST VERSION, POC",
    };
  }

  async signTransaction(transaction, options) {
    if (!transaction)
      throw new UALHyphaWalletError(
        "No transaction has been passed to sign transaction"
      );
    const { pollingInterval } = this;
    const uid = getTransactionUID(transaction);
    const callbackUrl = `${SEEDS_CALLBACK_HOST}/transaction?uid=${uid}&tx_id={{tx}}`;
    const esr = await this.esrUtil.encodeESR(
      transaction.actions,
      {
        url: callbackUrl,
        background: true,
      },
      {
        uid: uid,
        tx_id: "{{tx}}",
      }
    );
    const qrCode = await QRCode.toDataURL(esr);

    const dialog = this.getDialog(options, qrCode, esr);

    await this.dialog.showDialog(dialog);

    const txId = await poll(this.checkForConfirmation, uid, pollingInterval);

    const transactionInfo = await this.rpc.history_get_transaction(txId);

    this.dialog.hide();
    return transactionInfo;
  }

  async login(actions, loginCode) {
    const options = {
      title: "Login",
      subtitle:
        "Scan the QR-code with SEEDS Light Wallet on another device or use the button to open SEEDS Desktop Wallet on this device.",
    };

    const transactionInfo = await this.signTransaction({ actions }, options);
    const accountName = checkLoginData(transactionInfo, loginCode);

    const txId = transactionInfo.id;
    console.log("TRANSACTION INFO: ", transactionInfo);

    localStorage.setItem(
      StorageSessionKey,
      JSON.stringify({ accountName, loginCode, txId })
    );
    return accountName;
  }

  logout() {
    localStorage.removeItem(StorageSessionKey);
  }


  async restore() {
    const savedSessionRaw = await localStorage.getItem(StorageSessionKey);

    if (!savedSessionRaw) return;

    const { accountName, loginCode, txId } = JSON.parse(savedSessionRaw);

    const transactionInfo = await this.rpc.history_get_transaction(txId);

    const isLoginValid = checkLoginData(transactionInfo, loginCode);

    return isLoginValid && accountName;
  }
}

export default WebTransportLink;
