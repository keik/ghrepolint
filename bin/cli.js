#!/usr/bin/env node

const yargs = require("yargs");

const repolint = require("../src/repolint").default;

const argv = yargs
  .usage(
    "Lint for repository governance.\n\nUsage: repolint [options] <target>"
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
  .demandCommand(1, 1).argv;

repolint({
  target: argv._[0],
  verbose: argv.verbose,
});
