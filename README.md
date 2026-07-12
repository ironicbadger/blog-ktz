# ktz.blog

The code that powers https://blog.ktz.me.

## Setup

The host needs only Docker and `just`.

```sh
just admin setup
```

If Wrangler is already authenticated on the host, import that login into the
persistent Docker config. Otherwise, start a new browser login:

```sh
just admin login --import-local
just admin login
```

## Run

```sh
just admin dev    # Astro at localhost:4321
just admin site   # production-style nginx at localhost:8080
just admin check  # verify content, assets, and production build
```

## Write and publish

```sh
just new-tagged "My post title" "technical,hardware"
just feature my-post-title ~/Pictures/hero.jpg
just image my-post-title ~/Pictures/detail.jpg
just admin dev
just publish stage
just publish release
```

`stage` asks before checking the site, uploading assets to R2, and committing locally. `release` asks again before pushing that commit and starting the deployment.

Run `just` for the top-level recipes. Bare `just admin` and `just publish` list their available actions without doing anything. Deployment settings are in `deployment.config.json`; custom domains and DNS remain deferred.
