import { report } from "../reporter";
import * as Repositories from "../repositories";
import { Repository } from "../types";

export default {
  name: "require-topics",
  checker: async function (repo: Repository): Promise<void> {
    // TODO: configurable
    const opts = { required: true };
    const rawTopics = await Repositories.getTopics(repo);
    const topics = rawTopics.names;
    if (opts.required && topics.length === 0) {
      report({
        rule: this.name,
        repo: repo.name,
        message: "topics are not set.",
      });
    }
  },
};
