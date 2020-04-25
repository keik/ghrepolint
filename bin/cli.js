#!/usr/bin/env node

const repolint = require("../src/repolint").default;
const yargs = require("yargs");

const argv = yargs
  .usage("Lint for repository governance.\n\nUsage: repolint [options]")
  .help("help")
  .alias("help", "h")
  .options({
    verbose: {
      boolean: true,
      description: "Run with verbose logs",
      required: false,
    },
    org: {
      description: "Target repository owner orgs.",
      requiresArg: true,
      required: true,
    },
  }).argv;

(async () => {
  repolint({
    org: argv.org,
    verbose: argv.verbose,
  });
})();
