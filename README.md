# repolint

Lint for repository governance.

# usage

```
npx repolint -h
```

To target private repository set your GitHub API Token to environment variable `GITHUB_TOKEN`.

# development

Run source.

```
npx ts-node bin/cli.js --org github
```

Run tests.

```
npm t
```
