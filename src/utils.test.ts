import * as Utils from "./utils";

describe("getRepositoriesFromTarget", () => {
  test("with `eslint` org", async () => {
    expect(
      (await Utils.getRepositoriesFromTarget("eslint")).find(
        (a) => a.fullName === "eslint/eslint"
      )
    ).toBeTruthy();
  });
  test("with `keik` user", async () => {
    expect(
      (await Utils.getRepositoriesFromTarget("keik")).find(
        (a) => a.fullName === "keik/repolint"
      )
    ).toBeTruthy();
  });
  test("with `keik/repolint`", async () => {
    expect(
      (await Utils.getRepositoriesFromTarget("keik/repolint"))[0].fullName
    ).toBe("keik/repolint");
  });
});
