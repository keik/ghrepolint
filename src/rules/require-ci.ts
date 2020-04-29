import { report } from "../reporter";
import * as Repositories from "../repositories";
import { Context, Rule } from "../types";

const RULE_NAME = "require-ci";

const rule: Rule = {
  name: RULE_NAME,
  checker: async function (ctx: Context): Promise<void> {
    try {
      const contents = await Repositories.getContents({
        filepath: ctx.ruleConfig.path,
        repositoryName: ctx.repository.name,
        repositoryOwner: ctx.repository.owner,
      });

      // TODO: Lint YAML contents
      // const content = Buffer.from(rawContent.content ?? "", "base64").toString();
    } catch (e) {
      report({
        rule: RULE_NAME,
        repo: ctx.repository.name,
        message: `CI settings ${ctx.ruleConfig.path} is not exist.`,
      });
    }
  },
};

export default rule;
