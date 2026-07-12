#!/usr/bin/env node

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import rss from '@astrojs/rss';
import * as cheerio from 'cheerio';
import YAML from 'yaml';

const root = process.cwd();
const contentDirectory = path.join(root, 'src', 'content', 'posts');
const distDirectory = path.join(root, 'dist');
const site = 'https://blog.ktz.me';
const assetBase = (process.env.PUBLIC_ASSET_BASE_URL || '').replace(/\/$/, '');

function escapeXml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function absoluteUrl(value) {
	if (!value || /^(?:#|mailto:|tel:|data:|javascript:)/i.test(value)) return value || '';
	try {
		const parsed = new URL(value, `${site}/`);
		if (parsed.hostname === new URL(site).hostname && parsed.pathname.startsWith('/content/')) {
			return new URL(`${assetBase}${parsed.pathname}${parsed.search}${parsed.hash}`, `${site}/`).toString();
		}
		return parsed.toString();
	} catch {
		return value;
	}
}

function absolutizeHtml(html = '') {
	const $ = cheerio.load(html, null, false);
	$('[src], [href], [poster]').each((_index, element) => {
		for (const attribute of ['src', 'href', 'poster']) {
			const value = $(element).attr(attribute);
			if (value) $(element).attr(attribute, absoluteUrl(value));
		}
	});
	$('[srcset]').each((_index, element) => {
		const srcset = $(element).attr('srcset');
		if (!srcset) return;
		$(element).attr(
			'srcset',
			srcset
				.split(',')
				.map((candidate) => {
					const [url, descriptor] = candidate.trim().split(/\s+/, 2);
					return `${absoluteUrl(url)}${descriptor ? ` ${descriptor}` : ''}`;
				})
				.join(', '),
		);
	});
	return $.html();
}

function parsePost(source, filename) {
	const match = source.match(/^---\n([\s\S]*?)\n---\n/);
	if (!match) throw new Error(`Missing frontmatter: ${filename}`);
	return YAML.parse(match[1]);
}

async function renderedContent(post) {
	const { slug } = post;
	const html = await readFile(path.join(distDirectory, slug, 'index.html'), 'utf8');
	const $ = cheerio.load(html);
	const feature = post.featureImage
		? `<img src="${escapeXml(absoluteUrl(post.featureImage))}" alt="${escapeXml(post.featureImageAlt || post.title)}">`
		: '';
	return absolutizeHtml(`${feature}${$('.article-content').html() || ''}`);
}

function itemData(post) {
	const creator = post.authors?.[0]?.name
		? `<dc:creator>${escapeXml(post.authors[0].name)}</dc:creator>`
		: '';
	const media = post.featureImage
		? `<media:content url="${escapeXml(absoluteUrl(post.featureImage))}" medium="image"/>`
		: '';
	return `<guid isPermaLink="false">${escapeXml(post.ghostId)}</guid>${creator}${media}`;
}

function channelData(feedPath, posts) {
	const lastBuildDate = new Date(posts[0]?.updatedAt || Date.now()).toUTCString();
	const self = new URL(feedPath, `${site}/`).toString();
	return (
		'<language>en-us</language>' +
		`<generator>Astro</generator><lastBuildDate>${lastBuildDate}</lastBuildDate>` +
		`<atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml"/><ttl>60</ttl>`
	);
}

async function feedXml(title, description, posts, feedPath) {
	const response = await rss({
		title,
		description,
		site,
		items: await Promise.all(
			posts.slice(0, 15).map(async (post) => ({
				title: post.title,
				description: post.description,
				pubDate: new Date(post.publishedAt),
				link: `/${post.slug}/`,
				content: await renderedContent(post),
				categories: post.tags,
				customData: itemData(post),
			})),
		),
		xmlns: {
			dc: 'http://purl.org/dc/elements/1.1/',
			atom: 'http://www.w3.org/2005/Atom',
			media: 'http://search.yahoo.com/mrss/',
		},
		customData: channelData(feedPath, posts),
	});
	return response.text();
}

const filenames = (await readdir(contentDirectory)).filter((name) => /\.mdx?$/.test(name));
const posts = await Promise.all(
	filenames.map(async (filename) => parsePost(await readFile(path.join(contentDirectory, filename), 'utf8'), filename)),
);
posts.sort((a, b) => new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf());

const tags = new Map();
const authors = new Map();
for (const post of posts) {
	for (const tag of post.tags || []) {
		if (!tags.has(tag)) tags.set(tag, []);
		tags.get(tag).push(post);
	}
	for (const author of post.authors || []) {
		if (!authors.has(author.slug)) authors.set(author.slug, { author, posts: [] });
		authors.get(author.slug).posts.push(post);
	}
}

await Promise.all([
	...[...tags].map(async ([tag, taggedPosts]) => {
		const target = path.join(distDirectory, 'tag', tag, 'rss.xml');
		await writeFile(
			target,
			await feedXml(`${tag} - ktz.`, `Posts tagged ${tag}`, taggedPosts, `/tag/${tag}/rss/`),
		);
	}),
	...[...authors.values()].map(async ({ author, posts: authoredPosts }) => {
		const target = path.join(distDirectory, 'author', author.slug, 'rss.xml');
		await writeFile(
			target,
			await feedXml(
				`${author.name} - ktz.`,
				`Posts by ${author.name}`,
				authoredPosts,
				`/author/${author.slug}/rss/`,
			),
		);
	}),
]);

console.log(`Generated ${tags.size} tag feeds and ${authors.size} author feeds.`);
