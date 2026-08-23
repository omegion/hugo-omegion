# hugo-omegion

A minimal, sidebar-first [Hugo](https://gohugo.io) theme for a personal
blog + project showcase. Dark/light mode, client-side search, table of
contents, mermaid diagrams, syntax-highlighted code blocks with a copy
button, RSS, SEO/OpenGraph/JSON-LD metadata, and a responsive collapsible
sidebar.

Live example: [omegion.dev](https://omegion.dev), built with this theme.

## Requirements

Hugo **extended**, `0.146.0` or newer.

## Installation

### Option 1 — Hugo Modules (recommended)

In your site's `go.mod` (create one with `hugo mod init <your-module-path>`
if you don't have one):

```
require github.com/omegion/hugo-omegion v0.1.0
```

In your site config:

```yaml
module:
  imports:
    - path: "github.com/omegion/hugo-omegion"
```

Then run `hugo mod tidy`.

### Option 2 — Git submodule

```sh
git submodule add https://github.com/omegion/hugo-omegion.git themes/hugo-omegion
```

And set `theme: "hugo-omegion"` in your site config.

## Required site configuration

Hugo does **not** automatically inherit a theme's own config — only
`layouts/`, `assets/`, `archetypes/`, `static/`, `data/`, `i18n/` are
picked up automatically from an imported module or theme. The following
config is required for this theme to work correctly and must be set in
your own site. Copy it from
[`exampleSite/config/_default`](exampleSite/config/_default):

- **`enableEmoji: true`** — the theme uses `emojify` throughout.
- **`outputs.home`** must include `"searchindex"`, plus the matching
  `outputFormats.searchindex` definition — this powers `/index.json`,
  which the search modal fetches. See
  [`exampleSite/config/_default/config.yaml`](exampleSite/config/_default/config.yaml).
- **`markup.toml`** — `goldmark.renderer.unsafe = true` (for raw HTML in
  content), `highlight.style`/`noClasses = false` (for the themed code
  blocks), and `tableOfContents.startLevel`/`endLevel`. See
  [`exampleSite/config/_default/markup.toml`](exampleSite/config/_default/markup.toml).
- **`taxonomies.toml`** — `tag = "tags"`. The theme's templates link
  directly to `/tags/`, so this is effectively a fixed requirement, not a
  free choice. See
  [`exampleSite/config/_default/taxonomies.toml`](exampleSite/config/_default/taxonomies.toml).

The full [`exampleSite/`](exampleSite) is a working site built on this
theme — the fastest way to get started is to copy its `config/` and
`content/` structure into your own site and edit from there.

## Content structure

This theme has two content sections, each with its own layout:

### `content/posts/` — blog posts

```yaml
---
title: "Post Title"
date: 2026-01-05
draft: false
description: "Used for <meta description> / OpenGraph if summary is empty."
summary: "Shown on list pages and used as the meta description."
tags: ["tag-one", "tag-two"]
---
```

Set `groupByYear: true` in `content/posts/_index.md`'s `cascade` to group
the posts list page by year.

### `content/projects/` — project / work showcase

```yaml
---
title: "Project Name"
date: 2025-06-01           # "Launched" date shown on the page
website: "https://..."     # optional
github: "https://..."      # optional
docs: "https://..."        # optional
appStore: "https://..."    # optional, shows an App Store link
externalUrl: "https://..." # optional — if set, the project links out
                            # instead of to its own page; also used to
                            # infer website/github links if not set above
summary: "One-line summary shown in lists and at the top of the page."
tags: ["SaaS"]
discontinued: true                    # optional
discontinuedDate: 2025-01-01          # optional
discontinuedReason: "Why it ended."   # optional, markdown
lessonsLearned: "What I learned."     # optional, markdown
---
```

Drop a `logo.png` (or any `logo.*`) next to a project's `index.md` (as a
page bundle resource) to show a logo on its page.

## Params reference

All under `params:` (or `[params]`) in your site or language config:

| Param | Default | Description |
|---|---|---|
| `author.name` | — | Your name, used in the sidebar bio and structured data. |
| `author.bio` | — | List of bio lines shown under the site title. |
| `author.links` | — | List of `{name, url, icon}` — social/contact links in the sidebar. Icons: `github`, `linkedin`, `mail`. |
| `description` | — | Default site description (meta/OpenGraph fallback). |
| `dateFormat` | `2 January 2006` | Go time-format string used for displayed dates. |
| `enableSearch` | `false` | Show the search button and enable the search modal. |
| `enableTableOfContents` | `true` | Show a table of contents on posts (per-page override: `showTableOfContents` front matter). |
| `homepage.writingCount` | `6` | How many recent posts to show on the homepage. |
| `homepage.workCount` | `6` | How many recent projects to show on the homepage. |
| `search.recentPostsCount` | `3` | Recent posts shown in the empty search state. |
| `search.recentProjectsCount` | `3` | Recent projects shown in the empty search state. |

## Static assets

The theme links to (but does not ship) `static/favicon/apple-touch-icon.png`,
`favicon-32x32.png`, `favicon-16x16.png`, and `site.webmanifest` — provide
your own in your site's `static/favicon/`.

## Releases

Every merge to `main` automatically tags and publishes a new GitHub release
([workflow](.github/workflows/release.yml)). It defaults to a patch bump;
include `#minor` or `#major` in the commit/PR title for a bigger bump, or
`[skip release]` to skip releasing entirely.

## License

MIT — see [LICENSE](LICENSE).
