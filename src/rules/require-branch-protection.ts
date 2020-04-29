import { report } from "../reporter";
import * as Repositories from "../repositories";
import { BranchProtection, Context, Rule } from "../types";

const RULE_NAME = "require-branch-protection";

export const check = (ctx: Context, bp: BranchProtection): void => {
  if (ctx.ruleConfig.requiredStatusChecks) {
    ctx.ruleConfig.requiredStatusChecks.forEach((a: string) => {
      if (!bp.requiredStatusChecks.includes(a)) {
        report({
          rule: RULE_NAME,
          repo: ctx.repository.name,
          message: `Required status checks '${a}' is not exist.`,
        });
      }
    });
  }

  if (ctx.ruleConfig.requireCodeOwnerReviews && !bp.requireCodeOwnerReviews) {
    report({
      rule: RULE_NAME,
      repo: ctx.repository.name,
      message: `Pull request reviews are required.`,
    });
  }
};

const rule: Rule = {
  name: RULE_NAME,
  checker: async function (ctx: Context): Promise<void> {
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

    check(ctx, branchProtection);
  },
};

export default rule;
