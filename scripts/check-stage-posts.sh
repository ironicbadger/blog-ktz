#!/usr/bin/env bash

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

warning_count=0
post_count=0

warn() {
	if [[ "$warning_count" == "0" ]]; then
		printf '\nPublish readiness warnings:\n' >&2
	fi
	printf '  - %s\n' "$1" >&2
	warning_count=$((warning_count + 1))
}

has_tags() {
	awk '
		/^tags:[[:space:]]*\[[[:space:]]*\][[:space:]]*$/ {
			in_tags = 1
			next
		}
		/^tags:[[:space:]]*\[/ {
			found = 1
			next
		}
		/^tags:[[:space:]]*$/ {
			in_tags = 1
			next
		}
		in_tags && /^[[:space:]]+-[[:space:]]+/ {
			found = 1
			next
		}
		in_tags && /^[^[:space:]]/ {
			in_tags = 0
		}
		END {
			exit found ? 0 : 1
		}
	' "$1"
}

check_post() {
	local post="$1"
	[[ -f "$post" ]] || return
	post_count=$((post_count + 1))

	if grep -Eq '^drafts:[[:space:]]*true([[:space:]]*(#.*)?)?$' "$post"; then
		warn "$post: drafts is true, so the post will not be published"
	fi

	if ! has_tags "$post"; then
		warn "$post: tags is empty"
	fi
}

if [[ "$#" -gt "0" ]]; then
	for post in "$@"; do
		check_post "$post"
	done
else
	while IFS= read -r post; do
		[[ -n "$post" ]] && check_post "$post"
	done < <(
		{
			git diff --name-only --diff-filter=ACMR HEAD -- 'src/content/posts/*.md' 'src/content/posts/*.mdx'
			git ls-files --others --exclude-standard -- 'src/content/posts/*.md' 'src/content/posts/*.mdx'
		} | sort -u
	)
fi

if [[ "$post_count" -gt "0" && "$warning_count" == "0" ]]; then
	printf '\nPublish readiness: checked %s changed post(s); drafts are false and tags are set.\n' "$post_count"
fi

exit 0
