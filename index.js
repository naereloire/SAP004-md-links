#!/usr/bin/env node

// module.exports = () => {
//   // ...
// };
const program = require("commander");
const package = require("./package.json");

program.version(package.version);

program
  .command("md-links <path>")
  .description("Scan md file")
  .option("-v, --validate", "Validate link")
  .option("-s, --stats", "Statical of links in md file")
  .action((path, options) => {
    switch (true) {
      case options.validate && options.stats:
        console.log(path + " validação de stats");
        break;
      case options.validate:
        console.log(path + " valido");
        break;
      case options.stats:
        console.log(path + " stats");
        break;
      default:
        console.log(path + " não deu options");
    }
  });
program.parse(process.argv);
