import repolint from "./repolint";

describe("repolint", () => {
  test("with ", async () => {
    expect(await repolint({ org: "github" })).toBe(undefined);
  });
});
