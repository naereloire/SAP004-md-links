#!/usr/bin/env node

// module.exports = () => {
//   // ...
// };

const regexLinks = /\[[^\]]*\]\(http.*\)/g;
const regexSplitLink = /^\[|\]\(|\)$/g;
const program = require("commander");
const package = require("./package.json");
const fs = require("fs");
const https = require("https");
const http = require("http");
const { text } = require("figlet");

const validateLink = (objectLink) => {
  link = objectLink.href;
  if (link.startsWith("https")) {
    https.get(link, (res) => {
      objectLink["statusCode:"] = res.statusCode;
      console.log("Message:", res.statusMessage);
    });
  } else {
    http.get(link, (res) => {
      objectLink["statusCode:"] = res.statusCode;
      console.log("Message:", res.statusMessage);
    });
  }
  console.log(objectLink);
  return objectLink;
};

const findLink = (data) => {
  const arrayLinks = data.match(regexLinks);
  const arrayObjectLinks = [];
  for (const element of arrayLinks) {
    let arraySplitLinks = element.split(regexSplitLink);
    arraySplitLinks = arraySplitLinks.filter((element) => {
      return element !== "";
    });
    let objectLink = {
      text: arraySplitLinks[0],
      href: arraySplitLinks[1],
    };
    objectLink = validateLink(objectLink);

    arrayObjectLinks.push(objectLink);
  }
  return arrayObjectLinks;
};

const readDirectory = (err, files, currentPath) => {
  if (err) throw err;
  if (!currentPath.endsWith("/")) {
    currentPath += "/";
  }
  const filterDir = files.filter((element) => {
    return element.includes(".md");
  });
  if (!filterDir) {
    console.log("Diretório não possui arquivos com extensão md");
  } else {
    for (const element of filterDir) {
      fs.readFile(currentPath + element, "utf8", (err, data) => {
        readArchive(err, data, currentPath + element);
      });
    }
  }
};

const readArchive = (err, data, path) => {
  if (err) {
    throw err;
  }
  const findLinkReturn = findLink(data);
  for (const element of findLinkReturn) {
    // console.log(element);
    // console.log(`${path} ${element.href} ${element.text}`);
  }
};

const verifyPath = (currentPath) => {
  fs.stat(currentPath, (err, stats) => {
    if (!err) {
      if (stats.isFile()) {
        if (currentPath.includes(".md")) {
          fs.readFile(currentPath, "utf8", (err, data) => {
            readArchive(err, data, currentPath);
          });
        } else {
          console.log("Arquivo não possui extensão markdown");
        }
      } else if (stats.isDirectory()) {
        fs.readdir(currentPath, (err, data) => {
          readDirectory(err, data, currentPath);
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
