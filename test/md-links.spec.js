/* eslint-disable no-undef */
const mdLinks = require("../index.js");
const path = "./test.md";

describe("mdLinks", () => {
  it("is a function", () => {
    expect(typeof mdLinks).toBe("function");
  });
  it("Deveria criar um array de objetos e retorna-lo em uma promise", () => {
    expect(mdLinks(path)).tobe();
  });
});
