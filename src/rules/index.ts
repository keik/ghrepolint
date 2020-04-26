import { Rule } from "../types";

import requireBranchProtection from "./require-branch-protection";
import requireCi from "./require-ci";
import requireTopics from "./require-topics";

const rules: { [ruleName: string]: Rule } = {
  "require-branch-protection": requireBranchProtection,
  "require-ci": requireCi,
  "require-topics": requireTopics,
};

export default rules;
