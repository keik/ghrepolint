import chalk from "chalk";
import debug from "debug";

import { showReport } from "./reporter";
import { requireBranchProtection } from "./rules/require-branch-protection";
import { requireCI } from "./rules/require-ci";
import { requireTopics } from "./rules/require-topics";
import { Repository } from "./types";
import * as Utils from "./utils";

const d = debug("keik:repolint");

const check = async (repo: Repository): Promise<void> => {
  d(`check repo: ${repo.owner}/${repo.name}`);
  const checkers = [requireBranchProtection, requireCI, requireTopics];
  await Promise.all(checkers.map((c) => c(repo)));
};

export default async ({
  target,
  verbose,
}: {
  target: string;
  verbose?: boolean;
}): Promise<void> => {
  if (verbose)
    console.log(chalk.cyan(`start repolint to target: ${target}...`));
  const repos = await Utils.getRepositoriesFromTarget(target);

  if (verbose)
    console.log(chalk.cyan(`target repositories count: ${repos.length}`));

  await Promise.all(repos.map((a) => check(a)));

  showReport();
};
