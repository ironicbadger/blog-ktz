# ktz.blog

Astro replacement for `blog.ktz.me`. Markdown lives in Git, assets live in R2, and `main` deploys to Cloudflare Pages.

- Preview: https://blog-ktz.pages.dev
- Leave https://blog.ktz.me untouched for now

## Setup

The host needs only Docker and `just`.

```sh
just setup
```

If Cloudflare authentication is needed, run `just login` and open the URL it prints.

## Run

```sh
just dev       # Astro at localhost:4321
just site      # production-style nginx at localhost:8080
just check     # verify content, assets, and production build
```

## Write and publish

```sh
just new-tagged "My post title" "technical,hardware"
just feature my-post-title ~/Pictures/hero.jpg
just image my-post-title ~/Pictures/detail.jpg
just dev
just publish

git add .
git commit -m "Publish my post"
git push
```

`just feature` and `just image` print Markdown ready to paste. `just publish` validates everything, uploads changed assets to R2, and builds the site. GitHub Actions deploys the push.

Run `just` to list all recipes. Deployment settings are in `deployment.config.json`; custom domains and DNS remain deferred.
