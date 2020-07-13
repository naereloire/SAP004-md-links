/* eslint-disable no-undef */
const mdLinks = require("../index.js");

const path = "./test/test.md";
const directoryEmpty = "./test/no_files_md";
const expectArray = [
  {
    path: "./test/test.md",
    text: "learnyounode",
    href: "https://github.com/learnyounode",
  },
  {
    path: "./test/test.md",
    text: "how-to-npm",
    href: "https://github.com/workshopper/how-to-npm",
  },
  {
    path: "./test/test.md",
    text: "promise-it-wont-hurt",
    href: "https://github.com/stevekane/promise-it-wont-hurt",
  },
  {
    path: "./test/test.md",
    text: "promise-it-wont-hurt",
    href: "https://github.com/stevekane/promise-it-wont-hurt",
  },
];
const expectArrayValidate = [
  {
    path: "./test/test.md",
    text: "learnyounode",
    href: "https://github.com/learnyounode",
    status: 404,
    ok: "fail",
  },
  {
    path: "./test/test.md",
    text: "how-to-npm",
    href: "https://github.com/workshopper/how-to-npm",
    status: 200,
    ok: "ok",
  },
  {
    path: "./test/test.md",
    text: "promise-it-wont-hurt",
    href: "https://github.com/stevekane/promise-it-wont-hurt",
    status: 200,
    ok: "ok",
  },
  {
    path: "./test/test.md",
    text: "promise-it-wont-hurt",
    href: "https://github.com/stevekane/promise-it-wont-hurt",
    status: 200,
    ok: "ok",
  },
];

describe("mdLinks", () => {
  test("is a function", () => {
    expect(typeof mdLinks).toBe("function");
  });

  test("should create an array of objects and return it in a promise", () => {
    return expect(mdLinks(path)).resolves.toStrictEqual(expectArray);
  });
  test("should return an array of link objects, with status", () => {
    return expect(mdLinks(path, { validate: true })).resolves.toStrictEqual(
      expectArrayValidate
    );
  });

  test("should throw TypeError when there isn't md files in directory", () => {
    expect(() => mdLinks(directoryEmpty)).rejects.toMatch(
      "Não foi possível ler o arquivo"
    );
  });

  test("should throw TypeError when invoked with wrong argument types", () => {
    expect(() => mdLinks()).toThrow(TypeError);
    expect(() => mdLinks(0, {})).toThrow(TypeError);
  });
});
