import * as Repositories from ".";

describe("getRepositoriesFromTarget", () => {
  test("with `eslint` org", async () => {
    expect(
      (await Repositories.getRepositoriesFromTarget("eslint")).find(
        (a) => a.fullName === "eslint/eslint"
      )
    ).toBeTruthy();
  });
  test("with `keik` user", async () => {
    expect(
      (await Repositories.getRepositoriesFromTarget("keik")).find(
        (a) => a.fullName === "keik/repolint"
      )
    ).toBeTruthy();
  });
  test("with `keik/repolint`", async () => {
    expect(
      (await Repositories.getRepositoriesFromTarget("keik/repolint"))[0]
        .fullName
    ).toBe("keik/repolint");
  });
});
