import * as Utils from "./utils";

describe("detectTargetType", () => {
  test("with `github`", async () => {
    expect(await Utils.detectTargetType("github")).toBe("org");
  });
  test("with `keik`", async () => {
    expect(await Utils.detectTargetType("keik")).toBe("user");
  });
  test("with `_`", async () => {
    await expect(Utils.detectTargetType("_")).rejects.toThrow(
      "target is not found"
    );
  });
});
