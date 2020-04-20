import { Octokit } from "@octokit/rest";
import debug from "debug";

import { showReport } from "./reporter";
import { requireTopics } from "./rules/require-topics";
import { requireCI } from "./rules/require-ci";
import { Repo } from "./types";

const d = debug("keik:repolint");

// parameterize
const opts = {
  org: "github",
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Compare: https://developer.github.com/v3/repos/#list-organization-repositories
const main = async () => {
  const { data: rawRepos } = await octokit.repos.listForOrg({
    org: opts.org,
    per_page: 3, // TODO: 100 as maximum
  });
  // TODO: use paginate to target all repository
  // const data1 = await octokit.paginate(octokit.repos.listForOrg, {
  //   org: opts.org,
  //   per_page: 100,
  // });
  const repos: Array<Repo> = rawRepos.map(
    (a): Repo => {
      return {
        default_branch: a.default_branch,
        owner: a.owner.login,
        name: a.name,
        topics: a.topics,
      };
    }
  );

  // TODO: more parallelly
  await Promise.all(repos.map((a) => check(a)));

  showReport();
};

main();

const check = async (repo: Repo) => {
  d(`check repo: ${repo.name}`);
  const checkers = [requireTopics, requireCI, requireCI].map((a) => a(octokit));
  await Promise.all(checkers.map((c) => c(repo)));
};
