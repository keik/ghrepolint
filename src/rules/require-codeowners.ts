import { report } from "../reporter";

import * as Repositories from "../repositories";
import { Context, Rule } from "../types";

const RULE_NAME = "require-codeowners";

const rule: Rule = {
  name: RULE_NAME,
  checker: async function (ctx: Context): Promise<void> {
    const paths = [".github/CODEOWNERS", "CODEOWNERS", "docs/CODEOWNERS"];
    for (const path of paths) {
      try {
        const _contents = await Repositories.getContents({
          filepath: path,
          repositoryName: ctx.repository.name,
          repositoryOwner: ctx.repository.owner,
        });
        return;
      } catch (e) {
        // no op
      }
    }
    report({
      rule: RULE_NAME,
      repo: ctx.repository.name,
      message: `CODEOWNERS settings is not exist.`,
    });
  },
};

export default rule;
