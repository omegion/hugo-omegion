# AGENTS.md

Instructions for AI agents (and humans) working in this repository.

## Commit messages: Conventional Commits are required

Releases are automated by [release-please](https://github.com/googleapis/release-please-action)
(`.github/workflows/release-please.yml`). It reads commit messages on `main`
to decide the next version number and to generate `CHANGELOG.md`, so every
commit message must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

Common types:

- `feat:` — a new feature (bumps the **minor** version)
- `fix:` — a bug fix (bumps the **patch** version)
- `chore:`, `docs:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:` — no version bump, but still shown in the changelog
- Add `!` after the type/scope (e.g. `feat!:`) or a `BREAKING CHANGE:` footer for a breaking change (bumps the **major** version)

Examples:

```
fix(layouts): correct table of contents scroll offset
feat(search): add client-side fuzzy matching
feat!: drop support for Hugo < 0.146.0
```

When committing on behalf of the user, always write commit messages in this
format. Non-conforming commits are ignored by release-please and won't show
up in the changelog or trigger a release.

## How releases happen

1. Conventional commits land on `main`.
2. release-please opens/updates a "release PR" that bumps `version.txt` and
   updates `CHANGELOG.md`.
3. Merging that PR triggers release-please to tag the release and publish it
   on GitHub.

Do not hand-edit `version.txt` or `CHANGELOG.md` — release-please owns both.
