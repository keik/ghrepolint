import chalk from "chalk";
import debug from "debug";

import { showReport } from "./reporter";
import * as Repositories from "./repositories";
import requireBranchProtection from "./rules/require-branch-protection";
import requireCI from "./rules/require-ci";
import requireTopics from "./rules/require-topics";
import { Repository } from "./types";

const d = debug("keik:repolint");

const check = async (repo: Repository): Promise<void> => {
  d(`check repo: ${repo.owner}/${repo.name}`);
  const rules = [requireBranchProtection, requireCI, requireTopics];
  await Promise.all(
    rules.map((rule) => {
      debug(`keik:repolint:${rule.name}`)(`start ${repo.owner}/${repo.name}`);
      return rule.checker(repo);
    })
  );
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
  const repos = await Repositories.getRepositoriesFromTarget(target);

  if (verbose)
    console.log(chalk.cyan(`target repositories count: ${repos.length}`));

  await Promise.all(repos.map((a) => check(a)));

  showReport();
};
