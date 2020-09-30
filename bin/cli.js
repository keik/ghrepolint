#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const yargs = require("yargs");

const repolint = require("../lib/repolint").default;

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

const configPath = path.join(process.cwd(), ".repolintrc.js");
const config = fs.existsSync(configPath) ? require(configPath) : {};

repolint({
  target: argv._[0],
  config: config,
  verbose: argv.verbose,
});
