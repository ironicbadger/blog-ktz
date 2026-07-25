import { visit } from 'unist-util-visit';

const MAKERWORLD_HOSTS = new Set(['makerworld.com', 'www.makerworld.com']);
const MODEL_PATH = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?models\/(\d+)(?:-([^/]+))?\/?$/i;
const GITHUB_HOSTS = new Set(['github.com', 'www.github.com']);
const REPOSITORY_PATH = /^\/([a-z0-9_.-]+)\/([a-z0-9_.-]+?)(?:\.git)?\/?$/i;
const metadataCache = new Map();
const githubMetadataCache = new Map();

function escapeHtml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function modelReference(value) {
	try {
		const url = new URL(value);
		const match = url.protocol === 'https:' && MAKERWORLD_HOSTS.has(url.hostname) && url.pathname.match(MODEL_PATH);
		if (!match) return undefined;
		return { id: match[1], url: url.toString() };
	} catch {
		return undefined;
	}
}

function githubReference(value) {
	try {
		const url = new URL(value);
		const match = url.protocol === 'https:' && GITHUB_HOSTS.has(url.hostname) && url.pathname.match(REPOSITORY_PATH);
		if (!match) return undefined;
		return { owner: match[1], repository: match[2], url: url.toString() };
	} catch {
		return undefined;
	}
}

function cardDirective(node) {
	if (node.type !== 'paragraph') return undefined;
	const value = node.children
		.map((child) => {
			if (child.type === 'text') return child.value;
			if (child.type === 'link') return child.url;
			if (child.type === 'break') return '\n';
			return '';
		})
		.join('');
	const match = value.match(/^!!!card\b([^\n]*)(?:\n([\s\S]*))?$/i);
	if (!match) return undefined;

	const attributes = {};
	const attributePattern = /([a-z][\w-]*)=(?:"([^"]*)"|'([^']*)'|“([^”]*)”|‘([^’]*)’|(\S+))/gi;
	for (const attribute of match[1].matchAll(attributePattern)) {
		attributes[attribute[1].toLowerCase()] =
			attribute[2] ?? attribute[3] ?? attribute[4] ?? attribute[5] ?? attribute[6];
	}

	const bodyUrl = match[2]?.trim().match(/^https?:\/\/\S+$/i)?.[0];
	const type = attributes.type?.toLowerCase();
	const url = attributes.url || bodyUrl;
	return type && url ? { type, url } : undefined;
}

function positiveCount(value) {
	return Number.isFinite(value) && value >= 0 ? value : 0;
}

function safeImageUrl(value) {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' && url.hostname.endsWith('.bblmw.com') ? url.toString() : undefined;
	} catch {
		return undefined;
	}
}

function summaryGif(summary) {
	if (typeof summary !== 'string') return undefined;
	return summary.match(/<img\b[^>]*\bsrc=["']([^"']+\.gif(?:\?[^"']*)?)["']/i)?.[1];
}

function splitTitle(value) {
	const parts = String(value || 'MakerWorld model').split(/\s+[—–]\s+/);
	return {
		title: parts.shift(),
		subtitle: parts.join(' — '),
	};
}

function publishedDate(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return undefined;
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(date);
}

function compactCount(value) {
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);
}

async function fetchMetadata(id) {
	if (!metadataCache.has(id)) {
		metadataCache.set(
			id,
			(async () => {
				const response = await fetch(`https://makerworld.com/api/v1/design-service/design/${id}`, {
					headers: {
						accept: 'application/json',
						'user-agent': 'ktz-blog-build/1.0 (+https://blog.ktz.me)',
					},
					signal: AbortSignal.timeout(8_000),
				});
				if (!response.ok) throw new Error(`MakerWorld returned HTTP ${response.status}`);

				const model = await response.json();
				const image = safeImageUrl(summaryGif(model.summary)) || safeImageUrl(model.coverUrl);
				if (!model.title || !image) throw new Error('MakerWorld response is missing the title or image');

				return {
					name: model.title,
					image,
					creator: model.designCreator?.name || model.creator?.name || 'MakerWorld creator',
					published: publishedDate(model.createTime),
					stats: [
						{ count: positiveCount(model.likeCount), label: 'likes' },
						{ count: positiveCount(model.downloadCount), label: 'downloads' },
						{ count: positiveCount(model.collectionCount), label: 'saves', accessibleLabel: 'collections' },
						{ count: positiveCount(model.printCount), label: 'makes' },
					],
				};
			})(),
		);
	}
	return metadataCache.get(id);
}

function renderStat({ count, label, accessibleLabel = label }) {
	return `<span class="embed-card__stat" aria-label="${escapeHtml(`${count.toLocaleString('en-US')} ${accessibleLabel}`)}"><strong>${escapeHtml(compactCount(count))}</strong><span>${escapeHtml(label)}</span></span>`;
}

function renderCard(model, href) {
	const { title, subtitle } = splitTitle(model.name);
	const meta = [`by <strong>${escapeHtml(model.creator)}</strong>`, model.published && `Published ${escapeHtml(model.published)}`]
		.filter(Boolean)
		.join(' · ');

	return `<a class="embed-card embed-card--makerworld" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
  <span class="embed-card__media">
    <img src="${escapeHtml(model.image)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="${escapeHtml(`${model.name} by ${model.creator} on MakerWorld`)}">
    <span class="embed-card__brand">
      <span class="embed-card__brand-mark" aria-hidden="true">MW</span>
      <span>MakerWorld</span>
    </span>
    <span class="embed-card__stats" aria-label="MakerWorld model statistics">
      ${model.stats.map(renderStat).join('\n      ')}
    </span>
  </span>
  <span class="embed-card__body">
    <span class="embed-card__kicker">Original 3D model</span>
    <span class="embed-card__title">${escapeHtml(title)}</span>
    ${subtitle ? `<span class="embed-card__subtitle">${escapeHtml(subtitle)}</span>` : ''}
    <span class="embed-card__meta">${meta}</span>
    <span class="embed-card__footer">
      <span>View model on MakerWorld</span>
      <span aria-hidden="true">↗</span>
    </span>
  </span>
</a>`;
}

function githubHeaders() {
	const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
	return {
		accept: 'application/vnd.github+json',
		'user-agent': 'ktz-blog-build/1.0 (+https://blog.ktz.me)',
		'x-github-api-version': '2022-11-28',
		...(token ? { authorization: `Bearer ${token}` } : {}),
	};
}

async function fetchGithubMetadata(reference) {
	const key = `${reference.owner}/${reference.repository}`.toLowerCase();
	if (!githubMetadataCache.has(key)) {
		githubMetadataCache.set(
			key,
			(async () => {
				const response = await fetch(
					`https://api.github.com/repos/${encodeURIComponent(reference.owner)}/${encodeURIComponent(reference.repository)}`,
					{
						headers: githubHeaders(),
						signal: AbortSignal.timeout(8_000),
					},
				);
				if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`);

				const repository = await response.json();
				if (!repository.name || !repository.full_name || !repository.html_url) {
					throw new Error('GitHub response is missing repository metadata');
				}

				const previewKey = Date.parse(repository.pushed_at || repository.updated_at) || 1;
				return {
					name: repository.name,
					fullName: repository.full_name,
					owner: repository.owner?.login || reference.owner,
					description: repository.description || 'View this repository and its source code on GitHub.',
					image: `https://opengraph.githubassets.com/${previewKey}/${encodeURIComponent(reference.owner)}/${encodeURIComponent(reference.repository)}`,
					language: repository.language,
					license: repository.license?.spdx_id,
					stars: positiveCount(repository.stargazers_count),
					forks: positiveCount(repository.forks_count),
				};
			})(),
		);
	}
	return githubMetadataCache.get(key);
}

function renderGithubCard(repository, href) {
	const details = [repository.language, repository.license].filter(Boolean).map(escapeHtml).join(' · ');

	return `<a class="embed-card embed-card--github" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
  <span class="embed-card__media">
    <img src="${escapeHtml(repository.image)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="${escapeHtml(`GitHub preview for ${repository.fullName}`)}">
  </span>
  <span class="embed-card__body">
    <span class="embed-card__kicker">GitHub repository</span>
    <span class="embed-card__title">${escapeHtml(repository.name)}</span>
    <span class="embed-card__subtitle">${escapeHtml(repository.description)}</span>
    <span class="embed-card__meta">by <strong>${escapeHtml(repository.owner)}</strong>${details ? ` · ${details}` : ''}</span>
    <span class="embed-card__footer">
      <span>View repository on GitHub</span>
      <span class="embed-card__footer-meta">
        <span aria-label="${escapeHtml(`${repository.stars.toLocaleString('en-US')} stars`)}">★ ${escapeHtml(compactCount(repository.stars))}</span>
        <span aria-label="${escapeHtml(`${repository.forks.toLocaleString('en-US')} forks`)}">⑂ ${escapeHtml(compactCount(repository.forks))}</span>
        <span aria-hidden="true">↗</span>
      </span>
    </span>
  </span>
</a>`;
}

const cardRenderers = new Map([
	[
		'makerworld',
		async (url) => {
			const reference = modelReference(url);
			if (!reference) throw new Error('the MakerWorld card has an invalid model URL');
			return renderCard(await fetchMetadata(reference.id), reference.url);
		},
	],
	[
		'github',
		async (url) => {
			const reference = githubReference(url);
			if (!reference) throw new Error('the GitHub card requires a repository URL');
			return renderGithubCard(await fetchGithubMetadata(reference), reference.url);
		},
	],
]);

function fallbackLink(url) {
	return {
		type: 'paragraph',
		children: [
			{
				type: 'link',
				url,
				children: [{ type: 'text', value: 'View linked card' }],
			},
		],
	};
}

export default function remarkCards() {
	return async (tree) => {
		const cards = [];
		visit(tree, 'paragraph', (node, index, parent) => {
			if (!parent || index === undefined) return;
			const directive = cardDirective(node);
			if (directive) cards.push({ directive, index, parent });
		});

		await Promise.all(
			cards.map(async ({ directive, index, parent }) => {
				try {
					const renderer = cardRenderers.get(directive.type);
					if (!renderer) throw new Error(`card type "${directive.type}" is not supported`);
					parent.children[index] = { type: 'html', value: await renderer(directive.url) };
				} catch (error) {
					console.warn(`[card:${directive.type}] ${error.message}; rendering ${directive.url} as a regular link.`);
					parent.children[index] = fallbackLink(directive.url);
				}
			}),
		);
	};
}

export { cardDirective, cardRenderers, githubReference, modelReference, renderCard, renderGithubCard, splitTitle };
