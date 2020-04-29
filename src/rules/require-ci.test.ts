import { report } from "../reporter";
import * as Repositories from "../repositories";

import Rule from "./require-ci";

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

test.only("when exists CI config", async () => {
  mockedRepositories.getContents.mockResolvedValue("dummy config");

  await Rule.checker({
    repository,
    ruleConfig: { configFilepath: "./circleci/config.yml" },
  });

  expect(mockedReport.mock.calls.map((args) => args[0].message)).toEqual([]);
});

test.only("when not exists CI config", async () => {
  mockedRepositories.getContents.mockRejectedValue("not found.");

  await Rule.checker({
    repository,
    ruleConfig: { configFilepath: "./circleci/config.yml" },
  });

  expect(mockedReport.mock.calls.map((args) => args[0].message)).toEqual([
    "CI settings undefined is not exist.",
  ]);
});
