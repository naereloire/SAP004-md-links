const { findLink } = require("../file.js");

describe("findLinks", () => {
  it("is a function", () => {
    expect(typeof findLink).toBe("function");
  });
});
