#!/usr/bin/env node
const objectFuncs = require("./process-file.js");

const program = require("commander");
const pack = require("./package.json");
let validate = false;
let stats = false;

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
    verifyPath(path);
  });
program.parse(process.argv);
