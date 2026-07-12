set shell := ["bash", "-euo", "pipefail", "-c"]

host_uid := `id -u`
host_gid := `id -g`
dc := "HOST_UID=" + host_uid + " HOST_GID=" + host_gid + " docker compose"
run := dc + " run --rm --build tools"

default:
    @just --list

# Build the tooling image and restore assets from R2.
setup:
    {{ dc }} --profile tools build tools
    {{ run }} npm run assets:pull

# Run Astro's development server at http://localhost:4321.
dev:
    {{ dc }} run --rm --build --service-ports tools npm run dev

# Run the production-style nginx site at http://localhost:8080.
site:
    {{ dc }} up --build site

# Create an untagged Markdown post.
new title:
    {{ run }} npm run post:new -- "{{ title }}"

# Create a tagged Markdown post. Tags are comma-separated.
new-tagged title tags:
    {{ run }} npm run post:new -- "{{ title }}" --tags="{{ tags }}"

# Optimize an image and print Markdown. The source may be anywhere on the host.
image slug source:
    source_path="$(realpath "{{ source }}")"; source_name="$(basename "$source_path")"; {{ dc }} run --rm --build -v "$source_path:/media/$source_name:ro" tools npm run post:image -- "{{ slug }}" "/media/$source_name"

# Optimize an image and use it as the post's feature image.
feature slug source:
    source_path="$(realpath "{{ source }}")"; source_name="$(basename "$source_path")"; {{ dc }} run --rm --build -v "$source_path:/media/$source_name:ro" tools npm run post:image -- "{{ slug }}" "/media/$source_name" --feature

# Validate, upload changed assets to R2, and make a production build.
publish:
    {{ run }} npm run post:publish

# Restore or repair the ignored local asset tree from R2.
pull:
    {{ run }} npm run assets:pull

# Run content, asset-registry, local-asset, and production-build checks.
check:
    {{ run }} sh -lc 'npm run content:verify && npm run assets:registry:verify && npm run assets:verify && npm run build:production'

# Authenticate Wrangler inside the ignored project-local Docker cache.
login:
    {{ dc }} run --rm --build --service-ports tools wrangler login --browser=false --callback-host=0.0.0.0

# Open a shell in the tooling container.
shell:
    {{ run }} sh
