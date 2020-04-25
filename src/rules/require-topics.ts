import { Octokit } from "@octokit/rest";

import * as Utils from "../utils";
import { report } from "../reporter";
import { Repository } from "../types";

const RULE_NAME = "require-topics";

export const requireTopics = async (repo: Repository) => {
  // TODO: configurable
  const opts = { required: true };
  const rawTopics = await Utils.getTopics(repo);
  const topics = rawTopics.names;
  if (opts.required && topics.length === 0) {
    report({
      rule: RULE_NAME,
      repo: repo.name,
      message: "topics are not set.",
    });
  }
};
