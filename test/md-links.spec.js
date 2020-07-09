// const mdLinks = require('../');
const { findLink } = require("../index.js");

describe("findLinks", () => {
  it("is a function", () => {
    expect(typeof findLink).toBe("function");
  });
});
