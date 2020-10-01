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
        (a) => a.fullName === "keik/ghrepolint"
      )
    ).toBeTruthy();
  });
  test("with `keik/ghrepolint`", async () => {
    expect(
      (await Repositories.getRepositoriesFromTarget("keik/ghrepolint"))[0]
        .fullName
    ).toBe("keik/ghrepolint");
  });
});

describe("getContents", () => {
  test("of `README.md` from `keik/ghrepolint`", async () => {
    expect(
      await Repositories.getContents({
        filepath: "README.md",
        repositoryOwner: "keik",
        repositoryName: "ghrepolint",
      })
    ).toMatch("ghrepolint");
  });
  test("of `src` from `keik/ghrepolint`", async () => {
    await expect(
      Repositories.getContents({
        filepath: "src",
        repositoryOwner: "keik",
        repositoryName: "ghrepolint",
      })
    ).rejects.toThrow("Directory exits, not a file");
  });
  test("of `_` from `keik/ghrepolint`", async () => {
    await expect(
      Repositories.getContents({
        filepath: "_",
        repositoryOwner: "keik",
        repositoryName: "ghrepolint",
      })
    ).rejects.toThrow("Not Found");
  });
});
