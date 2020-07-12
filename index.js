#!/usr/bin/env node
const ObjectFuncs = require("./process-file.js");

/**
 * Função verifica arquivos com extensão Markdown (.md), indentifica links com a opção de valida-los.
 * @param {String} path Nome do diretório ou arquivo.
 * @param {Object} options Objeto contendo a key validade, que pode ser true ou false.
 * @returns {Promise} Retorna uma promisse contendo um array de objetos de links.
 */
const mdLinks = (path, options) => {
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
module.exports = mdLinks;
