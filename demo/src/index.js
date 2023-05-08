import React from "react";
import ReactDOM from "react-dom";
import { HyphaAuthenticator } from "ual-hypha-wallet";
import { UALProvider, withUAL } from "ual-reactjs-renderer";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const MY_CHAIN_ID =
  "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f";
const MY_CHAIN_HOST = "testnet.eos.miami";
const MY_CHAIN_PORT = "443";
const MY_CHAIN_PROTOCOL = "HTTPS";

const eosChain = {
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "eos.greymass.com",
      port: "443",
    },
  ],
};

const telosChain = {
  chainId: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "telos.greymass.com",
      port: "443",
    },
  ],
};

const myChain = {
  chainId: MY_CHAIN_ID,
  rpcEndpoints: [
    {
      protocol: MY_CHAIN_PROTOCOL,
      host: MY_CHAIN_HOST,
      port: MY_CHAIN_PORT,
    },
  ],
};

const seeds = new HyphaAuthenticator([telosChain], { appName: "Seeds App" });

const MyUALConsumer = withUAL(App);

ReactDOM.render(
  <React.StrictMode>
    <UALProvider
      chains={[telosChain]}
      authenticators={[seeds]}
      appName={"Seeds App"}
    >
      <MyUALConsumer />
    </UALProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
