#!/usr/bin/env node

// module.exports = () => {
//   // ...
// };

const regexLinks = /\[[^\]]*\]\(http.*\)/g;
const regexSplitLink = /^\[|\]\(|\)$/g;
const program = require("commander");
const package = require("./package.json");
const fs = require("fs");

const { text } = require("figlet");
let validate = false;
// let stats = false;
const superagent = require("superagent");

const validateLink = (objectLink) => {
  link = objectLink.href;
  superagent
    .get(link)
    .then((res) => {
      console.log(
        `${objectLink.path} ${objectLink.href} ${res.ok ? "ok" : "fail"}  
        ${res.statusCode}  ${objectLink.text}`
      );
    })
    .catch((error) => {
      console.log(
        `${objectLink.path} ${objectLink.href} 
        ${error.response.ok ? "ok" : "fail"}  
        ${error.response.statusCode}  ${objectLink.text}`
      );
    });
  //
};

const findLink = (data, path) => {
  const arrayLinks = data.match(regexLinks);
  const arrayObjectLinks = [];
  for (const element of arrayLinks) {
    let arraySplitLinks = element.split(regexSplitLink);
    arraySplitLinks = arraySplitLinks.filter((element) => {
      return element !== "";
    });
    let objectLink = {
      path,
      text: arraySplitLinks[0],
      href: arraySplitLinks[1],
    };

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

  const findLinkReturn = findLink(data, path);
  for (const element of findLinkReturn) {
    if (validate) {
      validateLink(element);
    } else {
      console.log(`${path} ${element.href} ${element.text}`);
    }
  }
};

const verifyPath = (currentPath) => {
  fs.stat(currentPath, (err, stats) => {
    if (!err) {
      if (stats.isFile()) {
        if (currentPath.includes(".md")) {
          fs.readFile(currentPath, "utf8", (err, data) => {
            readArchive(err, data, currentPath, validate);
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
    switch (true) {
      case options.validate && options.stats:
        break;
      case options.validate:
        validate = true;
        break;
      case options.stats:
        break;
      default:
        console.log(path + " não deu options");
    }
    verifyPath(path);
  });
program.parse(process.argv);
