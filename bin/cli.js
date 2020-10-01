#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const yargs = require("yargs");

const ghrepolint = require("../lib/ghrepolint").default;

const argv = yargs
  .usage(
    "Lint for repository governance.\n\nUsage: ghrepolint [options] <target>"
  )
  .help("help")
  .alias("help", "h")
  .options({
    verbose: {
      boolean: true,
      description: "Run with verbose logs",
      required: false,
    },
  })
  .options({
    rule: {
      description: "Specify rule.",
      required: false,
    },
  })
  .example(
    "ghrepolint github --rule 'require-branch-protection: { \"requireCodeOwnerReviews\": true }'"
  )
  .demandCommand(1, 1).argv;

const configPath = path.join(process.cwd(), ".ghrepolintrc.js");
const config = fs.existsSync(configPath) ? require(configPath) : {};

const rulesFromConfig = config.rules;
const rulesFromArgv = (Array.isArray(argv.rule)
  ? argv.rule
  : [argv.rule]
).reduce((acc, ruleString) => {
  try {
    const { name, value } = ruleString.match(
      "^(?<name>.+?):(?<value>.+)$"
    ).groups;
    return { ...acc, [name]: JSON.parse(value) };
  } catch (e) {
    throw new TypeError(
      "Invalid value for `rule` option: must be formed like '<name>: <value with JSON>'"
    );
  }
}, {});

ghrepolint({
  target: argv._[0],
  config: { ...config, rules: { ...rulesFromConfig, ...rulesFromArgv } },
  verbose: argv.verbose,
});
