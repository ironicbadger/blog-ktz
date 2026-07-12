# blog.ktz.me

Static Astro replacement for the Ghost blog at `https://blog.ktz.me`. The project keeps post and page source in Markdown, preserves Ghost slugs and taxonomy routes, recreates the Casper-derived presentation, and can serve the full site locally without Ghost or a database.

Production deploys to the `blog-ktz` Cloudflare Pages project. Media is served from the `blog-ktz-assets` R2 bucket, keeping the multi-gigabyte image library out of Git. The current preview is `https://blog-ktz.pages.dev`; `blog.ktz.me` is deliberately not attached yet.

## Architecture

- `src/content/posts/` and `src/content/pages/` contain imported Markdown. Frontmatter retains Ghost IDs, slugs, timestamps, authors, tags, excerpts, feature images, and SEO metadata.
- `src/pages/` generates the homepage, exact `/<slug>/` post and page routes, pagination, tag and author archives, RSS, sitemap, search index, and the 404 page. Legacy redirects live in `public/_redirects` for Pages and `docker/site.conf` for local nginx.
- `src/styles/global.css` and `src/components/` reproduce the Casper-based layout. Ghost gallery, callout, bookmark, and embed markup remains as small HTML islands inside Markdown where plain Markdown cannot express the original card.
- Shiki highlights fenced code during the static build. Gallery sizing is retained from Ghost, and YouTube/other iframes are responsive and lazy-loaded.
- `search-index.json` is generated from post titles, descriptions, tags, and body text. The homepage uses Fuse.js in the browser; no search service or server runtime is required.
- Asset references remain under `/content/`. `src/data/responsive-images.json` supplies available derivatives, while `PUBLIC_ASSET_BASE_URL` can move those URLs to an R2 custom domain at build time.
- `npm run build` runs Astro's type/content checks, produces `dist/`, then adds generated tag and author feeds.

## Prerequisites

- Node.js `>=22.12.0` and npm.
- SSH and rsync access to `ironicbadger@ktz-cloud` for the Ghost image mirror.
- Docker with Compose for the production-style local test.
- `uv` (or Python 3.11 with pip) only when rebuilding honeymoon images.
- A Wrangler login (`npx wrangler login`) or a scoped `CLOUDFLARE_API_TOKEN` when uploading to R2 or deploying Pages.

Install JavaScript dependencies with the lockfile:

```sh
npm ci
```

## Ghost content import

The importer reads published posts, pages, tags, authors, settings, HTML, and plaintext through Ghost's public Content API. It discovers the public key from the homepage unless `GHOST_CONTENT_KEY` is set.

```sh
GHOST_URL=https://blog.ktz.me npm run content:import
npm run content:verify
```

`content:import` removes and recreates `src/content/posts/` and `src/content/pages/`, then rewrites the Ghost-derived files in `src/data/`. Review its diff before keeping the result; manual edits in imported Markdown will be overwritten. A full API snapshot is also written to the ignored `.cache/ghost-api-export.json`.

`.env.example` documents the supported variables, but the Node scripts do not load `.env` themselves. Export variables in the shell or prefix the command as above.

## Ghost asset mirror

Images stay out of Git and the Docker image. On a fresh checkout, mirror Ghost's image tree and create the development symlink:

```sh
mkdir -p assets-local/content/images
rsync -a --progress \
  ironicbadger@ktz-cloud:/opt/appdata/ktz-blog/app/images/ \
  assets-local/content/images/
npm run assets:responsive
npm run assets:verify
```

`npm run dev` creates the ignored `public/content -> ../assets-local/content` link when needed. Production builds remove only that known symlink before Astro runs, preventing the asset mirror from being copied into `dist`; Docker and R2 serve media separately.

Mirror Ghost before applying the honeymoon replacements. A later rsync can restore Ghost's lower-resolution versions, in which case rerun the optimizer with `--apply`, regenerate the responsive index, and verify assets again. Do not add `--delete`: the optimizer creates responsive WebP derivatives that do not exist on Ghost.

## Local development and build

```sh
npm run dev
```

The dev server listens on `http://localhost:4321`. Before handing off a change, run:

```sh
npm run content:verify
npm run assets:verify
npm run build
npm run preview
```

`npm run preview` serves the completed `dist/` build. To test the future external-asset shape without deploying the site:

```sh
PUBLIC_ASSET_BASE_URL=https://assets.ktz.me npm run build
```

Leave `PUBLIC_ASSET_BASE_URL` empty for local `/content/` assets.

## Writing and publishing a post

Git stores the durable, reviewable parts of a post: Markdown, frontmatter, and the generated responsive-image index. Binary media stays in the ignored `assets-local/` tree and is uploaded directly to R2. A post can therefore be previewed locally with ordinary `/content/...` URLs while the production build rewrites the same URLs to the configured R2 origin.

Create a Markdown draft:

```sh
npm run post:new -- "My post title" --tags=technical,hardware
```

This creates `src/content/posts/my-post-title.md` with the standard frontmatter. Write in Markdown or rename it to `.mdx` when a post genuinely needs components.

Import one or more source images with automatic orientation, WebP optimization, a 2400 px maximum edge, and 600/1000/1600 px responsive versions:

```sh
npm run post:image -- my-post-title ~/Pictures/hero.jpg --feature
npm run post:image -- my-post-title ~/Pictures/detail-1.jpg ~/Pictures/detail-2.jpg
```

The command prints Markdown image syntax ready to paste. `--feature` also sets the first image as the post's feature image. It preserves the source aspect ratio and writes everything below `assets-local/content/images/YYYY/MM/<slug>/`; those files are intentionally ignored by Git.

Preview normally with `npm run dev`. When the post is ready:

```sh
npm run post:publish
```

That command regenerates `src/data/responsive-images.json`, verifies content and local media references, uploads only new or changed assets to R2, and performs a production build against the R2 origin. It does not commit or push for you: review the resulting Markdown/index diff, then commit and push it. CI rebuilds and publishes Pages from `main`.

On a new workstation, restore `assets-local/content` from the Ghost mirror or R2 before editing older media. New posts do not need the entire historic mirror if their own local files are present, but the full `assets:verify` and `post:publish` checks intentionally require all referenced assets.

## Honeymoon image rebuild

The matching input is committed as `data/honeymoon-image-matches.json`; there is currently no automatic matcher in this repository. Its current summary covers 143 Ghost asset paths: 134 are high-confidence matches to the photo library on `meeseeks`, while 9 intentionally retain the existing Ghost file.

The renderer expects matched originals below `.cache/honeymoon-originals/`, preserving paths relative to `/mnt/rust/photos/alex/images/2011`. This creates an rsync list from the committed mapping and includes XMP sidecars for matched RAW files:

```sh
mkdir -p .cache/honeymoon-originals
node --input-type=module <<'NODE' > .cache/honeymoon-files.txt
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('data/honeymoon-image-matches.json', 'utf8'));
const root = '/mnt/rust/photos/alex/images/2011/';
const files = new Set();

for (const match of manifest.matches) {
  if (!match.sourcePath) continue;
  if (!match.sourcePath.startsWith(root)) throw new Error(`Unexpected source: ${match.sourcePath}`);
  const relative = match.sourcePath.slice(root.length);
  files.add(relative);
  if (/\.arw$/i.test(relative)) files.add(relative.replace(/\.arw$/i, '.xmp'));
}

for (const file of [...files].sort()) console.log(file);
NODE

rsync -a --files-from=.cache/honeymoon-files.txt \
  meeseeks:/mnt/rust/photos/alex/images/2011/ \
  .cache/honeymoon-originals/
```

Create the ignored Python environment, render a review set, inspect it, then explicitly apply it:

```sh
uv venv --python 3.11 .cache/honeymoon-venv
uv pip install --python .cache/honeymoon-venv/bin/python -r requirements-honeymoon.txt

.cache/honeymoon-venv/bin/python scripts/optimize-honeymoon-images.py
# Review .cache/honeymoon-optimized and data/honeymoon-optimization-report.json.
.cache/honeymoon-venv/bin/python scripts/optimize-honeymoon-images.py --apply

npm run assets:responsive
npm run assets:verify
```

The optimizer aligns each high-resolution source to the old Ghost composition, transfers broad colour/tone edits, caps the long edge at 3200 px, strips metadata when encoding, and produces responsive WebP derivatives. XMP files are retained for audit but the current rawpy renderer does not apply their edits directly. On first apply it preserves the original Ghost references under `.cache/honeymoon-before/`; later runs use those backups to avoid generation loss.

`--apply` copies output into `assets-local` only when the full requested run succeeds. Do not combine it with `--limit` for the canonical rebuild. The committed `data/honeymoon-optimization-report.json` currently records 134 renders, 134 homography alignments, zero failures, and `applied: true`.

## Production-style Docker test

Compose builds Astro with Node 22, then serves `dist/` from unprivileged nginx on loopback. The filesystem is read-only apart from a small `/tmp`, and the large asset mirror is a read-only bind mount.

```sh
docker compose config
docker compose up --build -d
curl --fail http://localhost:8080/_healthz
open http://localhost:8080
docker compose logs site
docker compose down
```

Use `BLOG_PORT` to change the host port. Pass an asset origin only when intentionally testing R2-shaped URLs:

```sh
BLOG_PORT=4321 \
PUBLIC_ASSET_BASE_URL=https://assets.ktz.me \
docker compose up --build -d
```

nginx implements legacy RSS and AMP redirects, generated trailing-slash routing, the Astro 404 page, and separate cache policies for HTML, build artifacts, and mirrored content.

## R2 preparation and upload

Always regenerate the responsive index and verify assets after the final mirror/optimization pass. Then build the non-secret SHA-256 inventory:

```sh
npm run assets:responsive
npm run assets:verify
npm run assets:manifest
```

The ignored `.r2/assets-manifest.json` records each future `content/` object key, size, MIME type, cache policy, and digest. Manifest generation does not contact Cloudflare.

The uploader uses Cloudflare's object API with the current Wrangler login or `CLOUDFLARE_API_TOKEN`. It compares size, checksum, MIME type, and cache metadata, applies a 30-day cache policy, resumes safely after interruption, and never deletes remote objects. Dry-run before a manual bulk change:

```sh
npm run assets:upload -- --dry-run
npm run assets:upload
```

The non-secret account, bucket, Pages project, and preview asset origin live in `deployment.config.json`. `R2_ACCOUNT_ID` and `R2_BUCKET` can override that file. The real upload is non-deleting but does mutate Cloudflare state.

## Cloudflare deployment

The `CI` workflow validates pull requests. A push to `main` builds with the R2 preview origin and deploys `dist/` to the Pages project. It needs the `CLOUDFLARE_API_TOKEN` repository secret and `CLOUDFLARE_ACCOUNT_ID` repository variable.

For an authenticated manual deployment of an already-built `dist/` directory:

```sh
npm run deploy:pages
```

Attaching `blog.ktz.me`, creating a polished asset hostname, and changing DNS remain separate future steps. The current deployment must stay on the Cloudflare placeholder URLs until the migrated site is approved.
