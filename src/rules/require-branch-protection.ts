import { report } from "../reporter";
import * as Repositories from "../repositories";
import { BranchProtection, Context, Rule } from "../types";

const rule: Rule = {
  name: "require-branch-protection",
  checker: async function (ctx: Context): Promise<void> {
    let branchProtection: BranchProtection | null = null;
    try {
      branchProtection = await Repositories.getBranchProtection(ctx.repository);
    } catch (e) {
      report({
        rule: this.name,
        repo: ctx.repository.name,
        message: `Branch protection is not exist. (default branch: ${ctx.repository.defaultBranch})`,
      });
      return;
    }

    if (ctx.ruleConfig.requireStatusChecks) {
      ctx.ruleConfig.requireStatusChecks.forEach((a: string) => {
        if (!branchProtection?.requiredStatusChecks.includes(a)) {
          report({
            rule: this.name,
            repo: ctx.repository.name,
            message: `Required status checks '${a}' is not exist.`,
          });
        }
      });
    }

    if (
      ctx.ruleConfig.requireCodeOwnerReview &&
      !branchProtection?.requireCodeOwnerReviews
    ) {
      report({
        rule: this.name,
        repo: ctx.repository.name,
        message: `Pull request reviews are required.`,
      });
    }
  },
};

export default rule;
