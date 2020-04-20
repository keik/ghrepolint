import { Octokit } from "@octokit/rest";

import { report } from "../reporter";
import { Repo } from "../types";

const RULE_NAME = "require-ci";

export const requireCI = (octokit: Octokit) => async (repo: Repo) => {
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
      rule: RULE_NAME,
      repo: repo.name,
      message: `CI settings ${opts.path} is not exist.`,
    });
  }
};
