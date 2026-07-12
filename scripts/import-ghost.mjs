#!/usr/bin/env node

import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import YAML from 'yaml';

const root = process.cwd();
const ghostUrl = (process.env.GHOST_URL || 'https://blog.ktz.me').replace(/\/$/, '');
const contentRoot = path.join(root, 'src', 'content');
const dataRoot = path.join(root, 'src', 'data');
const cacheRoot = path.join(root, '.cache');
const brokenAssetReplacements = new Map([
	['blob:https://blog.ktz.me/be656d19-7bbb-434b-acfd-01b6f754ebd1', '/content/images/2023/03/image.png'],
]);
const brokenLinkReplacements = new Map([
	[
		'%5BRMRC%5D(https://www.readymaderc.com/products/details/strix-usb-power-adapter)',
		'https://www.readymaderc.com/products/details/strix-usb-power-adapter',
	],
	[
		'!%5B%5D(/content/images/2015/08/IMG_7495-1.jpg)',
		'/content/images/2015/08/IMG_7495-1.jpg',
	],
]);
const knownMissingAssets = new Set([
	'/content/images/size/w600/2025/01/IMG_1514.gif',
	'/content/images/size/w600/2026/04/recycler-magnified.gif',
]);
const knownBrokenExternalAssets = new Set([
	'https://forums.unraid.net/uploads/monthly_2018_09/favicon.ico.8ed25556cd37a2c082397863db15c0ba.ico',
	'https://forums.unraid.net/uploads/monthly_2017_02/BBall.thumb.jpg.d1bdf82e5ca93b059fb320ab4136f11e.jpg',
]);

async function requestText(url) {
	const response = await fetch(url, {
		headers: { 'user-agent': 'ktz-blog-migrator/1.0' },
	});
	if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
	return response.text();
}

async function discoverContentKey() {
	if (process.env.GHOST_CONTENT_KEY) return process.env.GHOST_CONTENT_KEY;
	const homepage = await requestText(`${ghostUrl}/`);
	const match = homepage.match(/data-key=["']([^"']+)["']/i);
	if (!match) {
		throw new Error('Could not discover the Ghost Content API key; set GHOST_CONTENT_KEY.');
	}
	return match[1];
}

async function api(resource, params = {}) {
	const url = new URL(`${ghostUrl}/ghost/api/content/${resource}/`);
	url.searchParams.set('key', contentKey);
	for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
	return JSON.parse(await requestText(url));
}

function internalUrl(value) {
	if (!value || typeof value !== 'string') return value || null;
	if (brokenAssetReplacements.has(value)) return brokenAssetReplacements.get(value);
	if (brokenLinkReplacements.has(value)) return brokenLinkReplacements.get(value);
	if (value.startsWith('//')) value = `https:${value}`;
	if (/^[\w.-]+\.[a-z]{2,}(?:[/?#]|$)/i.test(value)) value = `https://${value}`;
	try {
		const url = new URL(value, `${ghostUrl}/`);
		if (url.hostname === new URL(ghostUrl).hostname) {
			return `${url.pathname}${url.search}${url.hash}`;
		}
		return value;
	} catch {
		return value;
	}
}

function cleanNodeHtml(node) {
	return (node.outerHTML || '').replace(/\n{3,}/g, '\n\n').trim();
}

function fenceFor(code) {
	const longest = Math.max(2, ...[...code.matchAll(/`+/g)].map(([ticks]) => ticks.length));
	return '`'.repeat(longest + 1);
}

function detectLanguage(code) {
	const trimmed = code.trim();
	if (!trimmed) return '';
	if (/^[\[{]/.test(trimmed)) {
		try {
			JSON.parse(trimmed);
			return 'json';
		} catch {
			// Continue with conservative format heuristics.
		}
	}
	if (/^\s*(?:resource|data|variable|module|provider)\s+"/m.test(code)) return 'hcl';
	if (/^\s*(?:def |from \S+ import |import \S+|class \S+[:(])/m.test(code)) return 'python';
	if (/^\s*(?:const|let|var)\s+\w+|function\s+\w+\s*\(/m.test(code)) return 'javascript';
	if (/^\s*(?:\{\s*(?:config|pkgs)|let\s*$|environment\.|services\.)/m.test(code)) return 'nix';
	if (/^\s*</.test(trimmed) && /<\/\w+>|\/>/.test(trimmed)) return 'html';
	if (/^\s*server\s*\{[\s\S]*\b(?:location|proxy_pass|fastcgi_pass|server_name)\b/m.test(code)) return 'nginx';
	if (/^\s*[.#]?[-\w\s,:>+~\[\]="']+\s*\{[\s\S]*:\s*[^;]+;/m.test(code)) return 'css';
	if (
		/^(?:\[[^\]\n]+@[^\]\n]+(?::[^\]\n]*)?\]|[^\s@]+@[^\s:]+(?::\S*)?)[#$%]\s/m.test(code) ||
		/^[^\s@]+@[^\s]+\s+[^\n]*%\s/m.test(code)
	) {
		return 'shellsession';
	}
	if (/^(?:TASK \[|PLAY \[|PLAY RECAP|ok: \[|changed: \[|fatal: \[)/m.test(code)) return 'text';
	if (/^\s*(?:error:|hash mismatch in fixed-output derivation)/m.test(code)) return 'text';
	if (/^\d+:\s+\S+.*\b(?:mtu|qdisc|state)\b/m.test(code)) return 'shellsession';
	if (/^(?:nssm|netsh|New-NetFirewallRule)\b/m.test(code)) return 'powershell';
	if (/^\[(?:Unit|Service|Install)\]\s*$/m.test(code)) return 'ini';
	if (/^---\s*$/m.test(code) && /^[-\w.]+:\s*\S?/m.test(code)) return 'yaml';
	if (/^\s*[\w"'.-][\w"'. -]*:\s*\S?/m.test(code) && /^\s+(?:-|[\w"'.-]+:)/m.test(code)) return 'yaml';
	if (/^(?:\$ |# |\w+@[-\w]+:.*[$#] |sudo |apt(?:-get)? |docker |podman |kubectl |ssh |qm |ls |cat |cd |echo )/m.test(code)) return 'bash';
	if (/^\s*\[[^\]]+\]\s*$/m.test(code) && /^\s*[\w.-]+\s*=\s*.+$/m.test(code)) return 'ini';
	return '';
}

function languageFor(node, code) {
	const codeNode = node.querySelector?.('code');
	const className = `${codeNode?.getAttribute?.('class') || ''} ${node.getAttribute?.('class') || ''}`;
	const match = className.match(/(?:language|lang)-([\w.+-]+)/i);
	return match?.[1]?.toLowerCase() || detectLanguage(code);
}

function makeTurndown() {
	const service = new TurndownService({
		bulletListMarker: '-',
		codeBlockStyle: 'fenced',
		emDelimiter: '*',
		fence: '```',
		headingStyle: 'atx',
		strongDelimiter: '**',
	});
	service.use(gfm);

	service.addRule('ghostCodeCard', {
		filter: (node) =>
			node.nodeName === 'FIGURE' && node.classList?.contains('kg-code-card'),
		replacement: (_content, node) => {
			const pre = node.querySelector?.('pre');
			const code = (pre?.querySelector?.('code')?.textContent || pre?.textContent || '').replace(/\n$/, '');
			const fence = fenceFor(code);
			const language = pre ? languageFor(pre, code) : detectLanguage(code);
			const caption = node.querySelector?.('figcaption')?.innerHTML?.trim();
			const renderedCaption = caption
				? `\n<figcaption class="kg-code-caption">${caption}</figcaption>\n`
				: '';
			return `\n\n${fence}${language}\n${code}\n${fence}${renderedCaption}\n`;
		},
	});

	service.addRule('fencedCodeWithLanguage', {
		filter: (node) => node.nodeName === 'PRE',
		replacement: (_content, node) => {
			const code = (node.querySelector?.('code')?.textContent || node.textContent || '').replace(/\n$/, '');
			const fence = fenceFor(code);
			return `\n\n${fence}${languageFor(node, code)}\n${code}\n${fence}\n\n`;
		},
	});

	service.addRule('ghostCards', {
		filter: (node) =>
			['DIV', 'FIGURE'].includes(node.nodeName) &&
			(node.classList?.contains('kg-card') ||
				node.classList?.contains('kg-image-card') ||
				node.classList?.contains('postit')) &&
			!node.classList?.contains('kg-code-card'),
		replacement: (_content, node) => `\n\n${cleanNodeHtml(node)}\n\n`,
	});

	service.addRule('socialEmbeds', {
		filter: (node) =>
			node.nodeName === 'BLOCKQUOTE' &&
			(node.classList?.contains('twitter-tweet') || node.classList?.contains('instagram-media')),
		replacement: (_content, node) => `\n\n${cleanNodeHtml(node)}\n\n`,
	});

	service.addRule('embeddedScriptsAndFrames', {
		filter: ['iframe', 'script'],
		replacement: (_content, node) => `\n\n${cleanNodeHtml(node)}\n\n`,
	});

	service.addRule('underline', {
		filter: ['u'],
		replacement: (content) => `<u>${content}</u>`,
	});

	service.addRule('headingsWithStableIds', {
		filter: (node) => /^H[1-6]$/.test(node.nodeName) && Boolean(node.getAttribute?.('id')),
		replacement: (_content, node) => `\n\n${cleanNodeHtml(node)}\n\n`,
	});

	service.addRule('linkedInlineCode', {
		filter: (node) => node.nodeName === 'CODE' && Boolean(node.querySelector?.('a[href]')),
		replacement: (_content, node) => {
			const link = node.querySelector('a[href]');
			const label = (link?.textContent || '').replace(/`/g, '\\`');
			return '[`' + label + '`](' + link?.getAttribute('href') + ')';
		},
	});

	return service;
}

function htmlToMarkdown(html = '') {
	const $ = cheerio.load(`<main id="ghost-body">${html}</main>`, null, false);
	$('#ghost-body script[src*="giscus"], #ghost-body .giscus, #ghost-body .giscus-frame').remove();
	$('#ghost-body .kg-card-begin:empty, #ghost-body .kg-card-end:empty').remove();

	$('#ghost-body img').each((_index, element) => {
		const image = $(element);
		if (knownBrokenExternalAssets.has(image.attr('src') || '')) {
			image.remove();
			return;
		}
		image.attr('src', internalUrl(image.attr('src')) || '');
		const srcset = image.attr('srcset');
		if (srcset) {
			image.attr(
				'srcset',
				srcset
					.split(',')
					.map((candidate) => {
						const [url, descriptor] = candidate.trim().split(/\s+/, 2);
						const normalized = internalUrl(url);
						if (!normalized || knownMissingAssets.has(normalized)) return null;
						return `${normalized}${descriptor ? ` ${descriptor}` : ''}`;
					})
					.filter(Boolean)
					.join(', '),
			);
		}
		image.attr('loading', image.attr('loading') || 'lazy');
		image.attr('decoding', 'async');
	});

	$('#ghost-body .kg-gallery-image').each((_index, element) => {
		const container = $(element);
		const image = container.find('img').first();
		const width = Number(image.attr('width'));
		const height = Number(image.attr('height'));
		if (width > 0 && height > 0) {
			container.attr('style', `flex: ${(width / height).toFixed(6)} 1 0%`);
		}
	});

	$('#ghost-body th, #ghost-body td').each((_index, element) => {
		const cell = $(element);
		const alignment = cell.attr('style')?.match(/text-align\s*:\s*(left|center|right)/i)?.[1];
		if (alignment) cell.attr('align', alignment.toLowerCase());
	});

	$('#ghost-body a').each((_index, element) => {
		const link = $(element);
		const href = link.attr('href');
		if (href) link.attr('href', internalUrl(href));
	});

	$('#ghost-body iframe').each((_index, element) => {
		const frame = $(element);
		frame.attr('src', internalUrl(frame.attr('src')) || '');
		frame.attr('loading', 'lazy');
		if (!frame.attr('title')) {
			frame.attr('title', frame.attr('src')?.includes('youtube') ? 'YouTube video player' : 'Embedded media');
		}
	});

	$('#ghost-body script[src]').each((_index, element) => {
		const script = $(element);
		script.attr('src', internalUrl(script.attr('src')) || '');
	});

	$('#ghost-body .postit i').remove();

	const markdown = makeTurndown().turndown($('#ghost-body').html() || '');
	// Turndown may intentionally preserve blank lines inside fenced code blocks.
	// Avoid global whitespace collapsing here because it would alter source examples.
	return `${markdown.trim()}\n`;
}

function publicTags(item) {
	return (item.tags || []).filter((tag) => tag.visibility === 'public' && !tag.name.startsWith('#'));
}

function frontmatterFor(item, type) {
	const visibleTags = publicTags(item);
	const hiddenTags = (item.tags || []).filter((tag) => !visibleTags.includes(tag));
	const data = {
		title: item.title,
		slug: item.slug,
		description: item.custom_excerpt || item.excerpt || '',
		customExcerpt: item.custom_excerpt || null,
		publishedAt: item.published_at,
		updatedAt: item.updated_at,
		featureImage: internalUrl(item.feature_image),
		featureImageAlt: item.feature_image_alt || null,
		featureImageCaption: item.feature_image_caption || null,
		authors: (item.authors || []).map((author) => ({
			name: author.name,
			slug: author.slug,
			profileImage: internalUrl(author.profile_image),
		})),
		canonicalUrl: item.canonical_url || null,
		seo: {
			title: item.meta_title || item.og_title || null,
			description: item.meta_description || item.og_description || null,
			image: internalUrl(item.og_image || item.twitter_image),
		},
		ghostId: item.id,
	};

	if (type === 'post') {
		Object.assign(data, {
			tags: visibleTags.map((tag) => tag.slug),
			internalTags: hiddenTags.map((tag) => tag.slug),
			primaryTag: visibleTags[0]?.slug || null,
			featured: Boolean(item.featured),
			readingTime: item.reading_time || 0,
		});
	}

	return data;
}

async function writeEntries(items, type) {
	const directory = path.join(contentRoot, type === 'post' ? 'posts' : 'pages');
	await rm(directory, { recursive: true, force: true });
	await mkdir(directory, { recursive: true });

	for (const item of items) {
		const frontmatter = YAML.stringify(frontmatterFor(item, type), {
			lineWidth: 0,
			nullStr: 'null',
		}).trim();
		const markdown = htmlToMarkdown(item.html);
		await writeFile(path.join(directory, `${item.slug}.md`), `---\n${frontmatter}\n---\n\n${markdown}`);
	}
}

const contentKey = await discoverContentKey();
const [postsResult, pagesResult, tagsResult, authorsResult, settingsResult] = await Promise.all([
	api('posts', { limit: 'all', include: 'tags,authors', formats: 'html,plaintext' }),
	api('pages', { limit: 'all', include: 'tags,authors', formats: 'html,plaintext' }),
	api('tags', { limit: 'all', include: 'count.posts' }),
	api('authors', { limit: 'all', include: 'count.posts' }),
	api('settings'),
]);

await mkdir(dataRoot, { recursive: true });
await mkdir(cacheRoot, { recursive: true });
await Promise.all([
	writeEntries(postsResult.posts, 'post'),
	writeEntries(pagesResult.pages, 'page'),
	writeFile(path.join(dataRoot, 'site.json'), `${JSON.stringify(settingsResult.settings, null, 2)}\n`),
	writeFile(path.join(dataRoot, 'tags.json'), `${JSON.stringify(tagsResult.tags, null, 2)}\n`),
	writeFile(path.join(dataRoot, 'authors.json'), `${JSON.stringify(authorsResult.authors, null, 2)}\n`),
	writeFile(
		path.join(cacheRoot, 'ghost-api-export.json'),
		`${JSON.stringify(
			{
				exportedAt: new Date().toISOString(),
				source: ghostUrl,
				posts: postsResult.posts,
				pages: pagesResult.pages,
				tags: tagsResult.tags,
				authors: authorsResult.authors,
				settings: settingsResult.settings,
			},
			null,
			2,
		)}\n`,
	),
]);

console.log(`Imported ${postsResult.posts.length} posts and ${pagesResult.pages.length} pages from ${ghostUrl}.`);
