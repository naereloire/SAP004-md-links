#!/usr/bin/env node

// module.exports = () => {
//   // ...
// };

const regexLinks = /\[[^\]]*\]\(http.*\)/g;
const regexSplitLink = /\[|\]|\(|\)/g;

const program = require("commander");
const package = require("./package.json");
const fs = require("fs");
const { text } = require("figlet");

const readDirectory = (err, files) => {
  if (err) {
    throw err;
  }
  const filterDir = files.filter((element) => {
    return element.includes(".md");
  });
  if (!filterDir) {
    console.log("Diretório não possui arquivos com extensão md");
  } else {
    console.log(filterDir);
  }
};

const readArchive = (err, data) => {
  if (err) {
    throw err;
  }
  const arrayLinks = data.match(regexLinks);
  const objectLinks = [];
  for (const element of arrayLinks) {
    objectLinks.push({
      text: element.split(regexSplitLink)[1],
      href: element.split(regexSplitLink)[3],
    });
  }
  console.log(objectLinks);
};

const verifyPath = (currentPath) => {
  fs.stat(currentPath, (err, stats) => {
    if (!err) {
      if (stats.isFile()) {
        if (currentPath.includes(".md")) {
          fs.readFile(currentPath, "utf8", readArchive);
        } else {
          console.log("Arquivo não possui extensão markdown");
        }
      } else if (stats.isDirectory()) {
        fs.readdir(currentPath, readDirectory);
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
