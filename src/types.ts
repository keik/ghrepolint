export type BranchProtection = {
  requireCodeOwnerReviews: boolean;
  requiredStatusChecks: Array<string>;
};

export type Config = {
  rules: { [ruleName: string]: any };
};

export type Context = {
  repository: Repository;
  ruleConfig: any;
};

export type Repository = {
  defaultBranch: string;
  fullName: string;
  owner: string;
  name: string;
  topics: Array<string>;
};

export interface Rule {
  name: string;
  checker: (ctx: Context) => void;
}
