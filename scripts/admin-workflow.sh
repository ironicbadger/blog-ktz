#!/usr/bin/env bash

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

usage() {
	cat <<'EOF'
Available admin actions:
  just admin setup  Build the tooling image and restore assets from R2
  just admin hooks  Install this repository's Git safety hooks
  just admin dev    Run Astro at http://localhost:4321
  just admin site   Run the production-style site at http://localhost:8080
  just admin check  Validate content, assets, and the production build
  just admin pull   Restore or repair local assets from R2
  just admin login                 Authenticate Wrangler with Cloudflare
  just admin login --import-local  Reuse this host's existing Wrangler login
  just admin shell  Open a shell in the tooling container
EOF
}

install_git_hooks() {
	git config --local core.hooksPath .githooks
	echo 'Installed repository Git hooks from .githooks.'
}

dc() {
	HOST_UID="$(id -u)" HOST_GID="$(id -g)" docker compose "$@"
}

tools() {
	dc run --rm --build tools "$@"
}

local_wrangler_config() {
	local candidate
	for candidate in \
		"$HOME/Library/Preferences/.wrangler/config/default.toml" \
		"${XDG_CONFIG_HOME:-$HOME/.config}/.wrangler/config/default.toml" \
		"$HOME/.wrangler/config/default.toml"
	do
		if [[ -f "$candidate" ]]; then
			printf '%s\n' "$candidate"
			return 0
		fi
	done

	echo 'No local Wrangler login was found. Run Wrangler login on the host first.' >&2
	return 1
}

import_local_wrangler_login() {
	local source
	source="$(local_wrangler_config)"

	dc run --rm --build \
		--volume "$source:/wrangler-import/default.toml:ro" \
		tools sh -c '
			set -eu
			umask 077
			mkdir -p /config/.wrangler/config
			cp /wrangler-import/default.toml /config/.wrangler/config/default.toml.importing
			mv /config/.wrangler/config/default.toml.importing /config/.wrangler/config/default.toml
			wrangler whoami
		'

	echo 'Imported the host Wrangler login into the persistent tooling config.'
}

case "${1:-}" in
	setup)
		install_git_hooks
		dc --profile tools build tools
		tools npm run assets:pull
		;;
	hooks)
		install_git_hooks
		;;
	dev)
		dc run --rm --build --service-ports tools npm run dev
		;;
	site)
		dc up --build site
		;;
	check)
		tools sh -lc 'npm run content:verify && npm run assets:registry:verify && npm run assets:verify && npm run build:production'
		;;
	pull)
		tools npm run assets:pull
		;;
	login)
		case "${2:-}" in
			--import-local)
				import_local_wrangler_login
				;;
			'')
				dc run --rm --build --service-ports tools wrangler login --browser=false --callback-host=0.0.0.0
				;;
			*)
				echo "Unknown login option: $2" >&2
				exit 1
				;;
		esac
		;;
	shell)
		tools sh
		;;
	*)
		usage
		if [[ -n "${1:-}" ]]; then
			echo >&2
			echo "Unknown admin action: $1" >&2
			exit 1
		fi
		;;
esac
