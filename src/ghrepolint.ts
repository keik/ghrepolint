import chalk from "chalk";
import debug from "debug";

import { showReport } from "./reporter";
import * as Repositories from "./repositories";
import Rules from "./rules";
import { Config, Rule } from "./types";

export default async ({
  target,
  config,
  verbose,
}: {
  target: string;
  config: Config;
  verbose?: boolean;
}): Promise<void> => {
  if (verbose)
    console.log(chalk.cyan(`start ghrepolint to target: ${target}...`));

  const repos = await Repositories.getRepositoriesFromTarget(target);
  if (verbose)
    console.log(chalk.cyan(`target repositories count: ${repos.length}`));

  const rules = Object.keys(config.rules).map(
    (a) => (Rules as { [key: string]: Rule })[a]
  );

  await Promise.all(
    repos.map(async (repo) => {
      await Promise.all(
        rules.map((rule) => {
          debug(`keik:ghrepolint:${rule.name}`)(
            `start check: ${repo.owner}/${repo.name}`
          );
          return rule.checker({
            repository: repo,
            ruleConfig: config.rules[rule.name],
          });
        })
      );
    })
  );

  showReport();
};
