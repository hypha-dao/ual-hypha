import { v4 as uuidv4 } from "uuid";

export const poll = function (fn, data, interval, totalTimeout) {
  interval = interval || 100;
  totalTimeout = totalTimeout || 120000; 

  const startTime = Date.now(); 

  var checkCondition = async (resolve, reject) => {
    try {
      var result = await fn(data);
      if (result) {
        resolve(result);
      } else {
        if (Date.now() - startTime < totalTimeout) {
          setTimeout(checkCondition, interval, resolve, reject);
        } else {
          reject(new Error("Timeout"));
        }
      }
    } catch (error) {
      reject(error);
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
