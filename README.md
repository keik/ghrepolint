# ghrepolint

Lint for GitHub Repository governance.

## Usage

```
npx ghrepolint -h
```

To target private repository set your GitHub API Token to environment variable `GITHUB_TOKEN`.

## Rules

### `require-branch-protection`

Check branch protection settings.

To enable rule set value object which contains below keys:

* `requireCodeOwnerReviews: boolean`
* `requiredStatusChecks: Array<string>`

### `require-codeowners`

Check existetnce CODEOWNERS file.

To enable rule set value `true`.

## Development

### Build with watch and run

```
npm run watch
```

```
bin/cli.js --org github
```

### Test

```
npm t
```
