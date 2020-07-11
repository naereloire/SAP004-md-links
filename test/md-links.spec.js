/* eslint-disable no-undef */
const { findLink } = require("../process-file.js");

describe("findLinks", () => {
  it("is a function", () => {
    expect(typeof findLink).toBe("function");
  });
});
