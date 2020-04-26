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

describe("getContents", () => {
  test("of `README.md` from `keik/repolint`", async () => {
    expect(
      await Repositories.getContents({
        filepath: "README.md",
        repositoryOwner: "keik",
        repositoryName: "repolint",
      })
    ).toMatch("repolint");
  });
  test("of `src` from `keik/repolint`", async () => {
    await expect(
      Repositories.getContents({
        filepath: "src",
        repositoryOwner: "keik",
        repositoryName: "repolint",
      })
    ).rejects.toThrow("Directory exits, not a file");
  });
  test("of `_` from `keik/repolint`", async () => {
    await expect(
      Repositories.getContents({
        filepath: "_",
        repositoryOwner: "keik",
        repositoryName: "repolint",
      })
    ).rejects.toThrow("Not Found");
  });
});
