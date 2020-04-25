import repolint from "./repolint";

describe("repolint", () => {
  test("with ", async () => {
    expect(await repolint({ target: "github" })).toBe(undefined);
  });
});
