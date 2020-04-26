import { report } from "../reporter";
import * as Repositories from "../repositories";
import { Context, Rule } from "../types";

const rule: Rule = {
  name: "require-topics",
  checker: async function (ctx: Context): Promise<void> {
    const topics = await Repositories.getTopics(ctx.repository);
    if (topics.length === 0) {
      report({
        rule: this.name,
        repo: ctx.repository.name,
        message: "topics are not set.",
      });
    }
  },
};

export default rule;
