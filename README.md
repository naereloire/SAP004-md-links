<p align="center">
<img src="./mdImg.png" width="200" heigth="200" >
</p>

# Markdown Links :link:

## Índice

- [1. Resumo do projeto](#1-resumo-do-projeto)
- [2. LIB - library](#2-lib-library)
- [2.1 Instalação e utilização](#2.1-instalação-e-utilização)
- [3. CLI - Command Line Interface](#3-cli-command-line-interface)
- [3.1 Instalação e utilização](#3.1-instalação-e-utilização)
- [4. Montagem do ambiente de desenvolvimento](#4-montagem-do-ambiente-de-desenvolvimento)
- [4.1 Guia de estilo](#4.1-guia-de-estilo)

---

## 1. Resumo do projeto.

[Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) é uma sintaxe para padronizar e facilitar formatação de texto na web, funciona como um conversor de texto para html onde os caracteres não alfabéticos são traduzidos como tags.

Arquivos `Markdown` podem conter links, tabelas, imagens etc.

O objetivo da ferramenta `md links` é, localizar links em arquivos com extensão markdown (.md), podendo ainda realizar validações e gerar estatísticas simples como quantidade total de links nos arquivos, links únicos e quebrados.

Foram desevolvidas duas formas de implementação, `LIB` (library) e `CLI` (Command Line Interface).

## 2. LIB -Library

Conjuto de funções pré-compiladas, disponíveis para utilização no código.

### 2.1 Instalação e utilização

> :warning: Será necessária a utilização:

- [Node.js](https://nodejs.org/) que contém o [npm](https://docs.npmjs.com/) para instalação das dependências.

:zap: Instale executando:

```sh
npm install naereloire/md-links
```

Importe no seu código utilizando `require` :

```js
const mdLinks = require("md-links");
```

Execute fornecendo os argumentos:

> - `path`
>   caminho do diretório ou arquivo, relativou ou absoluto.
> - `options`
>   objeto contendo a key `validate` , com valor boleano.

##### Exemplo:

```js
//diretório e arquivo .md
mdLinks("./diretorio_exemplo/arquivo.md").then((links) => [{
    file,
    text,
    href
}])

//diretório
mdLinks("./diretorio_exemplo", {
        validate: true
    })
    .then(links => {
        => [{
            file,
            text,
            href,
            status,
            ok
        }]
    })
//Caso o diretório contenha mais de um arquivo .md
//os links de todos os arquivos serão resolvidos em um mesmo array.
```

## 3. CLI - Command Line Interface

Executável que pode ser executado através do terminal.

> :warning: Será necessária a utilização:

- [Node.js](https://nodejs.org/) que contém o [npm](https://docs.npmjs.com/) para instalação das dependências.

### 3.1 Instalação e utilização

:zap: Instale executando:

```sh
npm install -g naereloire/md-links
```

Execute fornecendo os argumentos:

> - `path`
>   Caminho do diretório ou arquivo, relativou ou absoluto.
> - `options`
>   Flags de validação e estatística, opicionais:
> - `--validate.`
> - `--stats.`
> - `--validate` e `--stats.`

##### Exemplo:

```sh
$ md-links ./diretorio_exemplo/arquivo.md
./diretorio_exemplo/arquivo.md http://exemplo1/ Link de algo
./diretorio_exemplo/arquivo.md http://exemplo2/ Link de algo
./diretorio_exemplo/arquivo.md http://exemplo3/ Link de algo
```

##### `--validate ou -v`

```sh
$ md-links ./diretorio_exemplo/arquivo.md --validate
./diretorio_exemplo/arquivo.md http://exemplo1/ ok 200 Link de algo
./diretorio_exemplo/arquivo.md http://exemplo2/ fail 404 Link de algo
./diretorio_exemplo/arquivo.md http://exemplo3/ ok 200 Link de algo
```

##### `--stats ou -s`

```sh
$ md-links ./diretorio_exemplo/arquivo.md --stats
Total:  3
Unique: 3
```

##### `--validate ou -v e stats ou -s`

```sh
$ md-links ./diretorio_exemplo/arquivo.md  --validate --stats
Total:  3
Unique: 3
Broken: 1
```

##### `--help ou -h`

Para acessar documentação.

### 4. Montagem do ambiente de desenvolvimento

> :warning: Será necessária a utilização:

- [Node.js](https://nodejs.org/) que contém o [npm](https://docs.npmjs.com/) para instalação das dependências.
- Lib [commander](https://github.com/tj/commander.js/) para desenvolvimento da CLI(Command Line Interface).
- Lib [superagent](https://github.com/visionmedia/superagent) para requisição via HTTP client

<p align="center">
<img src="https://media.giphy.com/media/11BbGyhVmk4iLS/giphy.gif" width="300" heigth="300"> 
</p>

- [Clone](https://help.github.com/articles/cloning-a-repository/) o projeto na sua máquina executando o seguinte comando no seu terminal:

-https

```sh
git clone https://github.com/naereloire/md-links.git
```

- Instale as dependências do projeto com o comando:

```sh
npm install
```

- Instale e execute o commander:

```sh
npm install commander
```

- Instale e execute o superagent:

```sh
npm install superagent
```

- Para executar localmente:

```sh
npm link
```

- Para executar os testes:

```sh
npm test
```

### 4.1 Guia de estilo

:warning: Neste projeto a regras de [ESLint](https://eslint.org/) seguem o padrão [Airbnb JavaScript Style Guide](https://github.com/armoucar/javascript-style-guide)

- Para verificar erros do ESLint:

```sh
npm run pretest
```

<p align="center">
Esse projeto faz parte do currículo do <a href="https://www.laboratoria.la/br">Bootcamp da Laboratória Brasil</a>
</p>

<p align="center">
Desenvolvimento <a href="https://github.com/naereloire">Naere Loire</a> :octocat:
</p>
