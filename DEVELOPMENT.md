# Development

This document describes the process for running this application on your local computer.

## Getting started

TBD

## Branch naming conventions

The project enforces the branch name.

```text
  <type>/<branch name>
     │      │
     |      └─> Summary in present tense. Not capitalized. No period at the end.
     |
     └─> Type: chore, docs, feat, fix, refactor, style, or test.
```

### Example

```text
  feat/new-feature
  fix/the-bug
  docs/readme
  style/update-button
  refactor/change-variable
  test/add-test
  chore/some-small-thing
  perf/improve-performance
  build/update-build-step
  ci/update-ci
  revert/revert-commit
  localize/add-korean-translation
  bump/bump-version
```

| type        | description       |
| ----------- | ----------------- |
| `build`     | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm) |
| `ci`        | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| `chore`     | Updating grunt tasks etc; no production code change, Other changes that don't modify src or test files |
| `docs`      | Changes to the documentation |
| `feat`      | New feature for the user, not a new feature for build script |
| `fix`       | Bug fix for the user, not a fix to a build script |
| `perf`      | A code change that improves performance |
| `refactor`  | Refactoring production code, eg. renaming a variable, A code change that neither fixes a bug nor adds a feature |
| `revert`    | Reverts a previous commit |
| `style`     | Formatting, missing semi colons, etc. (white-space, formatting, missing semi-colons, changes that do not affect the meaning of the code, etc); no production code change |
| `test`      | Adding missing tests, refactoring tests; no production code change |

## Commit message conventions

The project enforces commit message conventions. To know what patterns to use, please visit [commitlint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint) and [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

```text
  type(scope?): description  #scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")

  [optional body]

  [optional footer(s)]
```

Allowed types are:

- `build`
- `ci`
- `chore`
- `docs`
- `feat`
- `fix`
- `perf`
- `refactor`
- `revert`
- `style`
- `test`
