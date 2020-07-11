#!/usr/bin/env node
const ObjectFuncs = require("./process-file.js");

// eslint-disable-next-line no-undef
module.exports = mdLinks = (path, options) => {
  let validate = false;
  if (options) {
    validate = options.validate;
  }
  return new Promise((resolve, reject) => {
    const verify = new ObjectFuncs(false, validate, false);

    verify.verifyPath(path).then((promiseList) => {
      if (promiseList.length === 0) {
        reject("Não foi possível ler o arquivo");
      } else {
        Promise.all(promiseList).then((promResolve) => {
          let reduce = promResolve.reduce((accArrays, element) => {
            return accArrays.concat(element);
          }, []);
          resolve(reduce);
        });
      }
    });
  });
};
