#!/usr/bin/env node

// module.exports = () => {
//   // ...
// };
const program = require("commander");
const package = require("./package.json");

program.version(package.version);

program
  .command("md-links <path> [--validate] [--stats]")
  .description("Escaneia md file")
  .action((path) => {
    console.log(path);
  });
program.parse(process.argv);
