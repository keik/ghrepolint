import { report } from "../reporter";
import * as Repositories from "../repositories";

import Rule from "./require-branch-protection";

jest.mock("../repositories");
jest.mock("../reporter");

const mockedRepositories = Repositories as jest.Mocked<typeof Repositories>;
const mockedReport = report as jest.MockedFunction<typeof report>;

const repository = {
  defaultBranch: "master",
  fullName: "foo/bar",
  owner: "foo",
  name: "bar",
  topics: ["topic1"],
};

test("with empty config", async () => {
  mockedRepositories.getBranchProtection.mockResolvedValue({
    requireCodeOwnerReviews: false,
    requiredStatusChecks: ["a"],
  });

  await Rule.checker({ repository, ruleConfig: {} });

  expect(mockedReport.mock.calls.length).toBe(0);
});

test("with requireCodeOwnerReviews: true", async () => {
  mockedRepositories.getBranchProtection.mockResolvedValue({
    requireCodeOwnerReviews: false,
    requiredStatusChecks: ["a"],
  });

  await Rule.checker({
    repository,
    ruleConfig: { requireCodeOwnerReviews: true },
  });

  expect(mockedReport.mock.calls.map((args) => args[0].message)).toEqual([
    "Pull request reviews are required.",
  ]);
});

test('with requiredStatusChecks: ["a", "b", "c"]', async () => {
  mockedRepositories.getBranchProtection.mockResolvedValue({
    requireCodeOwnerReviews: false,
    requiredStatusChecks: ["a"],
  });

  await Rule.checker({
    repository,
    ruleConfig: { requiredStatusChecks: ["a", "b", "c"] },
  });

  expect(mockedReport.mock.calls.map((args) => args[0].message)).toEqual([
    "Required status checks 'b' is not exist.",
    "Required status checks 'c' is not exist.",
  ]);
});
