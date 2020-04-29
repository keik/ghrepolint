import { report } from "../reporter";

import { check } from "./require-branch-protection";

jest.mock("../reporter");

const mockedReport = report as jest.MockedFunction<typeof report>;

const repository = {
  defaultBranch: "master",
  fullName: "foo/bar",
  owner: "foo",
  name: "bar",
  topics: ["topic1"],
};

test("with empty config", async () => {
  check(
    { repository, ruleConfig: {} },
    {
      requireCodeOwnerReviews: false,
      requiredStatusChecks: ["a"],
    }
  );
  expect(mockedReport.mock.calls.length).toBe(0);
});

test("with requireCodeOwnerReviews: true", async () => {
  check(
    { repository, ruleConfig: { requireCodeOwnerReviews: true } },
    {
      requireCodeOwnerReviews: false,
      requiredStatusChecks: ["a"],
    }
  );
  expect(mockedReport.mock.calls.map((args) => args[0].message)).toEqual([
    "Pull request reviews are required.",
  ]);
});

test('with requiredStatusChecks: ["a", "b", "c"]', async () => {
  check(
    { repository, ruleConfig: { requiredStatusChecks: ["a", "b", "c"] } },
    {
      requireCodeOwnerReviews: false,
      requiredStatusChecks: ["a"],
    }
  );
  expect(mockedReport.mock.calls.map((args) => args[0].message)).toEqual([
    "Required status checks 'b' is not exist.",
    "Required status checks 'c' is not exist.",
  ]);
});
