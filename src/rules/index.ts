import { Rule } from "../types";

import requireBranchProtection from "./require-branch-protection";
import requireCi from "./require-ci";
import requireCodeowners from "./require-codeowners";
import requireTopics from "./require-topics";

const rules: { [ruleName: string]: Rule } = {
  "require-branch-protection": requireBranchProtection,
  "require-codeowners": requireCodeowners,
  "require-ci": requireCi,
  "require-topics": requireTopics,
};

export default rules;
