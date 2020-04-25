import { report } from "../reporter";
import { Repository } from "../types";
import * as Utils from "../utils";

const RULE_NAME = "require-topics";

export const requireTopics = async (repo: Repository): Promise<void> => {
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
