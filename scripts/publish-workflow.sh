#!/usr/bin/env bash

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

usage() {
	cat <<'EOF'
Usage:
  just publish stage    Check the site, upload assets to R2, and commit locally
  just publish release  Push the local commit to main and start deployment CI
EOF
}

require_main() {
	local branch
	branch="$(git branch --show-current)"
	if [[ "$branch" != "main" ]]; then
		echo "Publishing is only allowed from main; current branch is ${branch:-detached HEAD}." >&2
		exit 1
	fi
}

confirm_exact() {
	local expected="$1"
	local message="$2"
	local answer

	printf '\n%s\n\n' "$message"
	printf 'Type "%s" to continue: ' "$expected"
	read -r answer
	if [[ "$answer" != "$expected" ]]; then
		echo 'Cancelled; no publishing action was taken.'
		exit 0
	fi
}

docker_tools() {
	HOST_UID="$(id -u)" HOST_GID="$(id -g)" \
		docker compose run --rm --build tools "$@"
}

default_commit_message() {
	local changed_posts post_count post_file post_title
	changed_posts="$(git diff --cached --name-only --diff-filter=ACMR -- 'src/content/posts/*.md' 'src/content/posts/*.mdx')"
	post_count="$(printf '%s\n' "$changed_posts" | sed '/^$/d' | wc -l | tr -d ' ')"

	if [[ "$post_count" == "1" ]]; then
		post_file="$(printf '%s\n' "$changed_posts" | sed -n '1p')"
		post_title="$(sed -n 's/^title:[[:space:]]*//p' "$post_file" | sed -n '1p')"
		post_title="${post_title#\"}"
		post_title="${post_title%\"}"
		printf 'Publish %s' "$post_title"
	else
		printf 'Publish blog update'
	fi
}

stage_publication() {
	require_main
	git diff --check
	git diff --cached --check

	echo 'Pending Git changes:'
	if [[ -n "$(git status --short)" ]]; then
		git status --short
	else
		echo '  (none yet; the asset manifest may change during staging)'
	fi

	confirm_exact 'stage' 'Staging will upload files to R2, run pre-flight checks for publishing, and commit (but not push) files to Git locally.'

	docker_tools npm run post:stage
	git add -A
	git diff --cached --check

	if git diff --cached --quiet; then
		echo 'Pre-flight checks passed, but there are no Git changes to commit.'
		exit 0
	fi

	echo
	echo 'Local commit contents:'
	git diff --cached --stat

	BLOG_PUBLISH_STAGED=1 git commit -m "${BLOG_COMMIT_MESSAGE:-$(default_commit_message)}"

	echo
	echo 'Staging complete. Nothing was pushed.'
	echo 'Run `just publish release` when this local commit is ready to go live.'
}

release_publication() {
	require_main

	if [[ -n "$(git status --porcelain)" ]]; then
		echo 'The working tree is not clean. Run `just publish stage` first.' >&2
		git status --short >&2
		exit 1
	fi

	if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
		echo 'origin/main is unavailable; cannot determine what would be released.' >&2
		exit 1
	fi

	local ahead
	ahead="$(git rev-list --count origin/main..HEAD)"
	if [[ "$ahead" == "0" ]]; then
		echo 'There are no local commits waiting to be released.'
		exit 0
	fi

	echo 'Commits waiting to be released:'
	git log --oneline origin/main..HEAD

	confirm_exact 'release' "Release will push ${ahead} local commit(s) to origin/main. This starts CI and, if CI passes, makes the post publicly visible."

	git push origin main

	echo
	echo 'Release started. GitHub Actions now owns the deployment.'
}

case "${1:-}" in
	stage)
		stage_publication
		;;
	release)
		release_publication
		;;
	*)
		usage
		if [[ -n "${1:-}" ]]; then
			echo >&2
			echo "Unknown publish action: $1" >&2
			exit 1
		fi
		;;
esac
