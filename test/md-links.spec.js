/* eslint-disable no-undef */
const mdLinks = require("../index.js");
const path = "./test/test.md";

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
  it("is a function", () => {
    expect(typeof mdLinks).toBe("function");
  });

  test("Deveria criar um array de objetos e retorna-lo em uma promise", () => {
    return expect(mdLinks(path)).resolves.toStrictEqual(expectArray);
  });
  it("Deveria retornar um array de objetos de links, com status", () => {
    return expect(mdLinks(path, { validate: true })).resolves.toStrictEqual(
      expectArrayValidate
    );
  });
});
