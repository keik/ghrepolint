import { report } from "../reporter";
import * as Repositories from "../repositories";
import { Context, Rule } from "../types";

const rule: Rule = {
  name: "require-ci",
  checker: async function (ctx: Context): Promise<void> {
    // TODO: configurable
    const opts = { path: ".circleci/config.yml" };
    try {
      const rawContent = await Repositories.getContents(
        ctx.repository,
        opts.path
      );

      if (Array.isArray(rawContent)) throw new Error("directory exists.");

      // TODO: Lint YAML contents
      // const content = Buffer.from(rawContent.content ?? "", "base64").toString();
    } catch (e) {
      report({
        rule: this.name,
        repo: ctx.repository.name,
        message: `CI settings ${opts.path} is not exist.`,
      });
    }
  },
};

export default rule;
