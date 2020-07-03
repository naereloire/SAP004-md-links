#!/usr/bin/env node

// module.exports = () => {
//   // ...
// };

const program = require("commander");
const package = require("./package.json");
const fs = require("fs");

let currentPath = "/home/Área de Trabalho/laboratoria/SAP004-md-links";
const verifyFile = () => {
  fs.stat(currentPath, (err, stats) => {
    if (!err) {
      if (stats.isFile()) {
        console.log("is file?" + stats.isFile());
      } else if (stats.isDirectory()) {
        console.log("is directory?" + stats.isDirectory());
      }
    } else {
      throw err;
    }
  });
};

program.version(package.version);

program
  .command("md-links <path>")
  .description("Scan md file")
  .option("-v, --validate", "Validate link")
  .option("-s, --stats", "Statical of links in md file")
  .action((path, options) => {
    switch (true) {
      case options.validate && options.stats:
        verifyFile();

        break;
      case options.validate:
        verifyFile();

        break;
      case options.stats:
        verifyFile();

        break;
      default:
        console.log(path + " não deu options");
    }
  });
program.parse(process.argv);

// todo;
