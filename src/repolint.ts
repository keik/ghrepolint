import { Octokit } from "@octokit/rest";

import debug from "debug";

const d = debug("keik:repolint");

// parameterize
const opts = {
  org: "github",
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Repo = {
  default_branch: string;
  owner: string;
  name: string;
  topics: Array<string>;
};

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
  console.log(results);
};

main();

/**** reporter ****/
let results: Array<any> = [];
const report = (params: ReportParams) => {
  results.push(params);
};

/**** check executor ****/
const check = async (repo: Repo) => {
  d("check");
  const checkers = [topicChecker, ciChecker];
  await Promise.all(checkers.map((c) => c(repo)));
};

type ReportParams = {
  rule: string;
  repo: string;
  message: string;
};

/**** each checkers ****/
const topicChecker = async (repo: Repo) => {
  d("topicChecker");
  // TODO: configurable
  const opts = { required: true };
  const { data: rawTopics } = await octokit.repos.getAllTopics({
    owner: repo.owner,
    repo: repo.name,
  });

  const topics = rawTopics.names;
  if (opts.required && topics.length === 0) {
    report({
      rule: "topic/required",
      repo: repo.name,
      message: "topics are not set.",
    });
  }
};

const ciChecker = async (repo: Repo) => {
  d("ciChecker");
  // TODO: configurable
  const opts = { path: ".circleci/config.yml" };
  try {
    const { data: rawContent } = await octokit.repos.getContents({
      owner: repo.owner,
      repo: repo.name,
      path: opts.path,
    });

    if (Array.isArray(rawContent)) throw new Error("directory exists.");

    // TODO: Lint YAML contents
    // const content = Buffer.from(rawContent.content ?? "", "base64").toString();
  } catch (e) {
    report({
      rule: "ci/required",
      repo: repo.name,
      message: `CI settings ${opts.path} is not exist.`,
    });
  }
};
