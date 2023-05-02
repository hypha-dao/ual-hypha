import { v4 as uuidv4 } from "uuid";


export const poll = function (fn, data, interval) {
  interval = interval || 100;

  var checkCondition = async (resolve, reject) => {
    var result = await fn(data);
    if (result) {
      resolve(result);
    } else {
      setTimeout(checkCondition, interval, resolve, reject);
    }
  };

  return new Promise(checkCondition);
};

export const randomNumber = function (max = 100000000) {
  return Math.floor(Math.random() * max);
};

export const getTransactionUID = function (transaction) {
  return uuidv4();
};
