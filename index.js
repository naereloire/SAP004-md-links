#!/usr/bin/env node
const ObjectFuncs = require("./process-file.js");

const program = require("commander");
const pack = require("./package.json");
let validate = false;
let stats = false;

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    const verify = new ObjectFuncs(false, options.validate, false);

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

program.version(pack.version);

program
  .command("md-links <path>")
  .description("Scan md file")
  .option("-v, --validate", "Validate link")
  .option("-s, --stats", "Statical of links in md file")
  .action((path, options) => {
    if (options.validate) {
      validate = true;
    }
    if (options.stats) {
      stats = true;
    }
    const verify = new ObjectFuncs(true, validate, stats);
    verify.verifyPath(path);
  });
program.parse(process.argv);
