import debug from "debug";

import { showReport } from "./reporter";
import { requireBranchProtection } from "./rules/require-branch-protection";
import { requireCI } from "./rules/require-ci";
import { requireTopics } from "./rules/require-topics";
import { Repository } from "./types";
import * as Utils from "./utils";

const d = debug("keik:repolint");

export default async (params: { target: string; verbose?: boolean }) => {
  const repos = await Utils.getRepositoriesFromTarget(params.target);

  await Promise.all(repos.map((a) => check(a)));

  showReport();
};

const check = async (repo: Repository) => {
  d(`check repo: ${repo.name}`);
  const checkers = [requireBranchProtection, requireCI, requireTopics];
  await Promise.all(checkers.map((c) => c(repo)));
};
