#!/usr/bin/env node
const ObjectFuncs = require("./process-file.js");

const program = require("commander");
const pack = require("./package.json");
let validate = false;
let stats = false;

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (somethingSuccesfulHappened) {
      const successObject = {
        msg: "Success",
        data, //...some data we got back
      };
      resolve(successObject);
    } else {
      const errorObject = {
        msg: "An error occured",
        error, //...some error we got back
      };
      reject(errorObject);
    }
  });
};

program.version(pack.version);

program
  .command("md-links <path>")
  .description("Scan md file")
  .option("-v, --validate", "Validate link")
  .option("-s, --stats", "Statical of links in md file")
  .action((path, options) => {
    switch (true) {
      case options.validate && options.stats:
        validate = true;
        stats = true;
        break;
      case options.validate:
        validate = true;
        break;
      case options.stats:
        stats = true;
        break;
      default:
        console.log(path + " não deu options");
    }
    const verify = new ObjectFuncs(validate, stats);
    verify.verifyPath(path);
  });
program.parse(process.argv);
