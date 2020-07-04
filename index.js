#!/usr/bin/env node

// module.exports = () => {
//   // ...
// };

const program = require("commander");
const package = require("./package.json");
const fs = require("fs");

const verifyPath = (currentPath) => {
  fs.stat(currentPath, (err, stats) => {
    if (!err) {
      if (stats.isFile()) {
        fs.readFile(currentPath, (err, data) => {
          if (err) {
            throw err;
          }
          console.log(data);
        });
      } else if (stats.isDirectory()) {
        fs.readdir(currentPath, (err, files) => {
          if (err) {
            throw err;
          }
          console.log(files);
        });
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
    verifyPath(path);
    switch (true) {
      case options.validate && options.stats:
        break;
      case options.validate:
        break;
      case options.stats:
        break;
      default:
        console.log(path + " não deu options");
    }
  });
program.parse(process.argv);
