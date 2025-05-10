import { describe, it, expect } from "vitest";

describe("Basic sanity check", () => {
  it("true is truthy", () => {
    expect(true).toBeTruthy();
  });

  it("false is falsy", () => {
    expect(false).toBeFalsy();
  });
});
