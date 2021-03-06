/* eslint-disable no-unused-vars */
const regexLinks = /\[[^\]]*\]\(http.*\)/g;
const regexSplitLink = /^\[|\]\(|\)$/g;
const fs = require("fs");
const superagent = require("superagent");
const chalk = require("chalk");
const Table = require("cli-table");
let brokenLinks = 0;

function ObjectFn(isCli, validate, stats) {
  this.isCli = isCli;
  this.validate = validate;
  this.stats = stats;

  this.consoleCli = (menssage, fnChalk) => {
    if (isCli) {
      if (fnChalk) {
        console.log(fnChalk(menssage));
      } else {
        console.log(menssage);
      }
    }
  };
  /**
   * Função que aplica callback de função assíncrona sequencialmente.
   * @param {Array.<Object>} array Lista de obejetos(ex:Links de um arquivo .md)
   * @param {Function} fn Função callback, que será executada no itém.
   * @returns {Array.<Object>} Um array de objetos tratado de acordo a função callback.
   */
  this.processArray = (array, fn) => {
    var results = [];
    return array.reduce(function (p, item) {
      return p.then(function () {
        return fn(item).then(function (data) {
          results.push(data);
          return results;
        });
      });
    }, Promise.resolve());
  };
  /**
   * Função realiza verificações estatísticas, no array de objetos de links (ex: total de links,links quebrados e únicos.)
   * @param {Array.<Object>} arrayLinks
   * @param {String} currentPath
   */
  this.statsLink = (arrayLinks, currentPath) => {
    const uniqueLinks = Array.from(new Set(arrayLinks.map((a) => a.href))).map(
      (href) => {
        return arrayLinks.find((a) => a.href === href);
      }
    );
    if (this.validate) {
      this.processArray(arrayLinks, (element) => {
        return this.validateLink(element, false);
      }).then(() => {
        this.consoleCli(currentPath);
        let table = new Table({
          head: [
            chalk.magentaBright("Total"),
            chalk.magentaBright("Unique"),
            chalk.magentaBright("Broken"),
          ],
        });
        table.push([
          chalk.green(arrayLinks.length),
          chalk.green(uniqueLinks.length),
          chalk.red(brokenLinks),
        ]);
        this.consoleCli(table.toString());
      });
    } else {
      this.consoleCli(currentPath, chalk.green);
      let table = new Table({
        head: [chalk.magentaBright("Total"), chalk.magentaBright("Unique")],
      });
      table.push([
        chalk.yellow(arrayLinks.length),
        chalk.yellow(uniqueLinks.length),
      ]);
      this.consoleCli(table.toString());
    }
  };
  /**
   * Função realiza validação de status do link, com a opção de mostrar no console.
   * @param {Object} objectLink Objeto de links.
   * @param {Boolean} printValidate Flag que indica se o status deve ou não ser mostrado no console.
   * @returns {Promise} Que resolve um novo array de objetos, adicionando novas keys de validação.
   */
  this.validateLink = (objectLink, printValidate = true) => {
    let link = objectLink.href;
    return new Promise((resolve, reject) => {
      superagent
        .get(link)
        .then((res) => {
          if (printValidate) {
            this.consoleCli(
              [
                objectLink.path,
                objectLink.href,
                res.ok ? "ok" : "fail",
                res.statusCode,
                objectLink.text,
              ].join(" "),
              chalk.green
            );
          }
          objectLink.status = res.statusCode;
          objectLink.ok = res.ok ? "ok" : "fail";
          resolve(objectLink);
        })
        .catch((error) => {
          brokenLinks += 1;
          if (printValidate) {
            this.consoleCli(
              [
                objectLink.path,
                objectLink.href,
                error.response.ok ? "ok" : "fail",
                error.response.statusCode,
                objectLink.text,
              ].join(" "),
              chalk.red
            );
          }
          objectLink.status = error.response.statusCode;
          objectLink.ok = error.response.ok ? "ok" : "fail";
          resolve(objectLink);
        });
    });
  };
  /**
   * Função cria array de objetos de links, utilizando expressão regular para indentificar links.
   * @param {String} data Contém todo o conteúdo do arquivo markdown.
   * @param {String} path Nome do arquivo markdown.
   * @returns {Array.<Object>} Lista de obejtos de links, contendo path, text e href como keys.
   */
  this.findLink = (data, path) => {
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
  /**
   * Função busca arquivos com extensão Markdown, no diretório fornecido.
   * @param {Error} err Erro capturado pela função fs.readdir.
   * @param {Array.<String>} files Lista de arquivos encontrados no diretório.
   * @param {String} currentPath Nome do diretório.
   * @returns {Array.<String>} Array de arquivos filtrados com extão Markdown.
   */
  this.findFilesDirectory = (err, files, currentPath) => {
    if (err) throw err;
    if (!currentPath.endsWith("/")) {
      currentPath += "/";
    }
    const filterDir = files.filter((element) => {
      return element.includes(".md");
    });
    return filterDir;
  };
  /**
   * Função realiza leitura dos arquivos com extensão markdown.
   * @param {Array.<String>} filterDir Array de arquivos filtrados com extão Markdown.
   * @param {String} currentPath Nome do diretório.
   * @returns {Promises} Array de promises, que resolve o array de objetos de links de cada arquivo.
   */
  this.readMultipleFiles = (filterDir, currentPath) => {
    let promisesArray = [];
    if (!filterDir) {
      this.consoleCli(
        "Diretório não possui arquivos com extensão md",
        chalk.red
      );
      return [];
    } else {
      for (const element of filterDir) {
        promisesArray.push(
          new Promise((resolve, reject) => {
            fs.readFile(currentPath + element, "utf8", (err, data) => {
              this.readArchive(err, data, currentPath + element).then(
                (arrayObject) => {
                  resolve(arrayObject);
                }
              );
            });
          })
        );
      }
      return promisesArray;
    }
  };

  /**
   * realiza leitura de um arquivo com extensão markdown.
   * @param {Error} err Erro capturado pela função fs.readfile.
   * @param {String} data Conteúdo encontrado no arquivo markdown.
   * @param {String} path Caminho com o nome do arquivo.
   * @returns {Promise} Que resolve o array de objetos de links.
   */
  this.readArchive = (err, data, path) => {
    if (err) {
      throw err;
    }
    const findLinkReturn = this.findLink(data, path);
    return new Promise((resolve, reject) => {
      let newArrayObjectLinks = [];
      if (this.stats) {
        this.statsLink(findLinkReturn, path);
      } else {
        if (this.validate) {
          this.processArray(findLinkReturn, (element) => {
            return this.validateLink(element, true);
          }).then((objArray) => {
            resolve(objArray);
          });
        } else {
          for (const element of findLinkReturn) {
            newArrayObjectLinks.push(element);
            this.consoleCli(
              `${path} ${element.href} ${element.text}`,
              chalk.green
            );
          }
          resolve(newArrayObjectLinks);
        }
      }
    });
  };
  /**
   * Função que verificar se o caminho passado é um diretório ou um arquivo, acionando a função para o caminho correspondente.
   * @param {String} currentPath Nome do caminho.
   * @returns {Promise} Resolve um array de promises.
   */
  this.verifyPath = (currentPath) => {
    let promisesReturn = new Promise((resolve, reject) => {
      let promiseResolve;
      fs.stat(currentPath, (err, status) => {
        if (err) {
          throw err;
        }
        if (status.isFile()) {
          if (currentPath.includes(".md")) {
            promiseResolve = [
              new Promise((resolve, reject) => {
                fs.readFile(currentPath, "utf8", (err, data) => {
                  this.readArchive(err, data, currentPath, validate).then(
                    (arrayObject) => {
                      resolve(arrayObject);
                    }
                  );
                });
              }),
            ];
          } else {
            resolve([]);
            this.consoleCli("Arquivo não possui extensão markdown", chalk.red);
          }
        } else if (status.isDirectory()) {
          promiseResolve = new Promise((resolve, reject) => {
            new Promise((resolve, reject) => {
              fs.readdir(currentPath, (err, data) => {
                let filterDir = this.findFilesDirectory(err, data, currentPath);
                resolve(filterDir);
              });
            }).then((filterDir) => {
              resolve(this.readMultipleFiles(filterDir, currentPath));
            });
          });
        }
        resolve(promiseResolve);
      });
    });
    return promisesReturn;
  };
}
module.exports = ObjectFn;
