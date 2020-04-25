import * as Utils from "./utils";

describe("detectTargetType", () => {
  test("with `github`", async () => {
    expect(await Utils.detectTargetType("github")).toBe("org");
  });
  test("with `keik`", async () => {
    expect(await Utils.detectTargetType("keik")).toBe("user");
  });
  test("with `keik/repolint`", async () => {
    expect(await Utils.detectTargetType("keik/repolint")).toBe("repo");
  });
  test("with `keik/repo/lint`", async () => {
    try {
      await Utils.detectTargetType("keik/repo/lint");
    } catch (e) {
      expect(String(e)).toBe(String(new Error("target is invalid")));
    }
  });
  test("with `_`", async () => {
    try {
      await Utils.detectTargetType("_");
    } catch (e) {
      expect(String(e)).toBe(String(new Error("target is not found")));
    }
  });
});
