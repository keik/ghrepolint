import { report } from "../reporter";
import * as Repositories from "../repositories";
import { BranchProtection, Context, Rule } from "../types";

const RULE_NAME = "require-branch-protection";

const rule: Rule = {
  name: RULE_NAME,
  checker: async (ctx: Context): Promise<void> => {
    let branchProtection: BranchProtection | null = null;
    try {
      branchProtection = await Repositories.getBranchProtection(ctx.repository);
    } catch (e) {
      report({
        rule: RULE_NAME,
        repo: ctx.repository.name,
        message: `Branch protection is not exist. (default branch: ${ctx.repository.defaultBranch})`,
      });
      return;
    }

    if (ctx.ruleConfig.requiredStatusChecks) {
      ctx.ruleConfig.requiredStatusChecks.forEach((a: string) => {
        if (!branchProtection?.requiredStatusChecks.includes(a)) {
          report({
            rule: RULE_NAME,
            repo: ctx.repository.name,
            message: `Required status checks '${a}' is not exist.`,
          });
        }
      });
    }

    if (
      ctx.ruleConfig.requireCodeOwnerReviews &&
      !branchProtection.requireCodeOwnerReviews
    ) {
      report({
        rule: RULE_NAME,
        repo: ctx.repository.name,
        message: `Pull request reviews are required.`,
      });
    }
  },
};

export default rule;
