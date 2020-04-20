import { Octokit } from "@octokit/rest";

import { report } from "../reporter";
import { Repo } from "../types";

const RULE_NAME = "require-topics";

export const requireTopics = (octokit: Octokit) => async (repo: Repo) => {
  // TODO: configurable
  const opts = { required: true };
  const { data: rawTopics } = await octokit.repos.getAllTopics({
    owner: repo.owner,
    repo: repo.name,
  });

  const topics = rawTopics.names;
  if (opts.required && topics.length === 0) {
    report({
      rule: RULE_NAME,
      repo: repo.name,
      message: "topics are not set.",
    });
  }
};
