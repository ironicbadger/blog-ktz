# ktz.blog

Static Astro replacement for `blog.ktz.me`. Posts are Markdown, assets live in Cloudflare R2, and pushes to `main` deploy to Cloudflare Pages.

- Preview: https://blog-ktz.pages.dev
- Production Ghost site: https://blog.ktz.me — leave this untouched for now

## Setup

Requires Node.js 22+.

```sh
npm ci
npm run assets:pull
```

`assets:pull` restores the ignored local asset library from R2. Skip it if `assets-local/content` already exists.
Run `npx wrangler login` once on a new machine before publishing assets.

## Run locally

```sh
npm run dev
```

Open http://localhost:4321.

For the Docker build served on port 8080:

```sh
docker compose up --build
```

## Write and publish

Create a Markdown post:

```sh
npm run post:new -- "My post title" --tags=technical,hardware
```

Optimize images and optionally set the first one as the feature image:

```sh
npm run post:image -- my-post-title ~/Pictures/hero.jpg --feature
```

Paste the printed Markdown into the post. When it is ready:

```sh
npm run post:publish
git add .
git commit -m "Publish my post"
git push
```

`post:publish` validates the content, uploads new or changed assets to R2, and runs the production build. GitHub Actions deploys successful pushes to Pages.

## Useful checks

```sh
npm run content:verify
npm run assets:verify
npm run build
```

The deployment configuration is in `deployment.config.json`. Cloudflare custom domains and DNS are intentionally deferred.
