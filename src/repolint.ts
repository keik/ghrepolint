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
  console.log(results.map((a) => JSON.stringify(a)).join("\n"));
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
  const checkers = [topicChecker, ciChecker, branchProtectionChecker];
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

const branchProtectionChecker = async (repo: Repo) => {
  d("branchProtectionChecker");
  const opts = {
    required: {
      required_status_checks: {
        contexts: [
          "ci/circleci: rspec",
          "ci/circleci: test_js",
          "ci/circleci: eslint_flow",
          "ci/circleci: danger",
          "danger/danger",
        ],
      },
      required_pull_request_reviews: { require_code_owner_reviews: true },
    },
  };
  try {
    const {
      data: rawBranchProtection,
    } = await octokit.repos.getBranchProtection({
      owner: repo.owner,
      repo: repo.name,
      branch: repo.default_branch,
    });
    if (opts.required.required_status_checks) {
      if (opts.required.required_status_checks.contexts) {
        opts.required.required_status_checks.contexts.forEach((a) => {
          if (
            !rawBranchProtection.required_status_checks.contexts.includes(a)
          ) {
            report({
              rule: "branchProtection/required",
              repo: repo.name,
              message: `Required status checks '${a}' is not exist.`,
            });
          }
        });
      }
    }
    if (opts.required.required_pull_request_reviews) {
      if (
        opts.required.required_pull_request_reviews
          .require_code_owner_reviews &&
        !rawBranchProtection.required_pull_request_reviews
          .require_code_owner_reviews
      ) {
        report({
          rule: "branchProtection/required",
          repo: repo.name,
          message: `Pull request reviews are required.`,
        });
      }
    }
  } catch (e) {
    report({
      rule: "branchProtection/required",
      repo: repo.name,
      message: `Branch protection is not exist. (default branch: ${repo.default_branch})`,
    });
  }
};
