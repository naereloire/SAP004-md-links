const regexLinks = /\[[^\]]*\]\(http.*\)/g;
const regexSplitLink = /^\[|\]\(|\)$/g;
const fs = require("fs");
const superagent = require("superagent");
let brokenLinks = 0;

const objectFn = {
  processArray: (array, fn) => {
    return array.reduce(function (p, item) {
      return p.then(function () {
        return fn(item);
      });
    }, Promise.resolve());
  },
  statsLink: (arrayLinks) => {
    const uniqueLinks = Array.from(new Set(arrayLinks.map((a) => a.href))).map(
      (href) => {
        return arrayLinks.find((a) => a.href === href);
      }
    );
    console.log(`Total:${arrayLinks.length} \nUnique:${uniqueLinks.length}`);
    if (validate) {
      processArray(arrayLinks, (element) => {
        return validateLink(element, false);
      }).then(() => {
        console.log(`Broken:${brokenLinks}`);
      });
    }
  },

  validateLink: (objectLink, printValidate = true) => {
    link = objectLink.href;
    return superagent
      .get(link)
      .then((res) => {
        if (printValidate) {
          console.log(
            `${objectLink.path} ${objectLink.href} ${res.ok ? "ok" : "fail"}  
            ${res.statusCode}  ${objectLink.text}`
          );
        }
      })
      .catch((error) => {
        brokenLinks += 1;
        if (printValidate) {
          console.log(
            `${objectLink.path} ${objectLink.href} 
            ${error.response.ok ? "ok" : "fail"}  
            ${error.response.statusCode}  ${objectLink.text}`
          );
        }
      });
    //
  },

  /**
   * Função cria array de objetos de links, utilizando expressão regular para indentificar links.
   * @param {String} data Contém todo o conteúdo do arquivo markdown.
   * @param {String} path Nome do arquivo markdown.
   * @returns Array de obejtos de links, contendo path, text e href como keys.
   */
  findLink: (data, path) => {
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
  },

  readDirectory: (err, files, currentPath) => {
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
  },

  readArchive: (err, data, path) => {
    if (err) {
      throw err;
    }

    const findLinkReturn = findLink(data, path);
    if (stats) {
      statsLink(findLinkReturn);
    } else {
      for (const element of findLinkReturn) {
        if (validate) {
          validateLink(element);
        } else {
          console.log(`${path} ${element.href} ${element.text}`);
        }
      }
    }
  },

  verifyPath: (currentPath) => {
    fs.stat(currentPath, (err, status) => {
      if (!err) {
        if (status.isFile()) {
          if (currentPath.includes(".md")) {
            fs.readFile(currentPath, "utf8", (err, data) => {
              readArchive(err, data, currentPath, validate);
            });
          } else {
            console.log("Arquivo não possui extensão markdown");
          }
        } else if (status.isDirectory()) {
          fs.readdir(currentPath, (err, data) => {
            readDirectory(err, data, currentPath);
          });
        }
      } else {
        throw err;
      }
    });
  },
};
module.exports = objectFn;
