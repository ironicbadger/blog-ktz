set shell := ["bash", "-euo", "pipefail", "-c"]

host_uid := `id -u`
host_gid := `id -g`
dc := "HOST_UID=" + host_uid + " HOST_GID=" + host_gid + " docker compose"
run := dc + " run --rm --build tools"

[private]
_help:
    @just --list

# Run setup, development, maintenance, and diagnostic operations.
admin action="" option="":
	@bash scripts/admin-workflow.sh "{{ action }}" "{{ option }}"

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

# Stage or release a publication, with explicit confirmation before changes.
publish action="":
    @bash scripts/publish-workflow.sh "{{ action }}"
