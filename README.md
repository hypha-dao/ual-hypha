# UAL Hypha Authenticator 🔐

[UAL](https://github.com/EOSIO/universal-authenticator-library) implementation of Hypha Authenticator for Hypha Wallet. 


## Overview

The Universal Authenticator Library creates a single universal API which allows app developers to integrate ***multiple*** signature providers with just a few lines of code. This is done through custom `Authenticators`.

An `Authenticator` represents the bridge between [UAL](https://github.com/EOSIO/universal-authenticator-library/tree/develop/packages/universal-authenticator-library) and a custom signing method.

A developer that wishes to add support for their signature provider to UAL must create an `Authenticator` by implementing 2 classes. An `Authenticator` and a `User`.

The `Authenticator` class represents the business logic behind the renderer, handles login/logout functionality and initializes the `User` class.

Logging in returns 1 or more User objects. A `User` object provides the ability for an app developer to request the app `User` sign a transaction using whichever authenticator they selected when logging in.

## Installation
`npm i ual-hypha`  ( or `yarn add ual-hypha` )

## Configurable parameters

### Environment variables

UAL has two kind of polls - first it polls a backend for a UID placed there by the wallet callback

Once this UID is found, it returns a transaction ID

Then it polls history on an EOSIO node to find the transaction and verify it happened.

The polling and timeout intervals relate to these functions. 

EOSIO/Antelope nodes have different update speeds - meaning when the transaction shows up in history is different. They also may have request throttles on them so we can't make too many requests in too short a time period.

UAL_HYPHA_POLL_INTERVAL: Backend polling heinterval - default 1 second
UAL_HYPHA_POLL_TIMEOUT: Backend polling timeout - default 10 minutes

UAL_HYPHA_TX_CHECK_INTERVAL: History polling interval - default 1 second
UAL_HYPHA_TX_CHECK_TIMEOUT: History polling timeout - default 30 seconds

## Usage

In your main app js file

```
const telosChain = {
  chainId: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "api.telosfoundation.io",
      port: "443",
    },
  ],
};

const hypha = new HyphaAuthenticator([telosChain], { appName: "Hypha App" });


```
