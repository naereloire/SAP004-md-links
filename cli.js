#!/usr/bin/env node

const ObjectFuncs = require("./process-file.js");
const program = require("commander");
const pack = require("./package.json");
let validate = false;
let stats = false;

program.version(pack.version);

program
  .command(" <path>")
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
