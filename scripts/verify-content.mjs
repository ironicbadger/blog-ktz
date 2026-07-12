#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const postsDirectory = path.join(root, 'src', 'content', 'posts');
const pagesDirectory = path.join(root, 'src', 'content', 'pages');

async function markdownFiles(directory) {
	return (await readdir(directory)).filter((name) => /\.mdx?$/.test(name));
}

const [posts, pages] = await Promise.all([markdownFiles(postsDirectory), markdownFiles(pagesDirectory)]);
const problems = [];

for (const [collection, name] of [
	...posts.map((filename) => ['posts', filename]),
	...pages.map((filename) => ['pages', filename]),
]) {
	const source = await readFile(path.join(root, 'src', 'content', collection, name), 'utf8');
	if (!source.startsWith('---\n')) problems.push(`${collection}/${name}: missing frontmatter`);
	if (/https?:\/\/blog\.ktz\.me\/content\//.test(source)) {
		problems.push(`${collection}/${name}: contains an absolute Ghost asset URL`);
	}
	if (/<pre(?:\s|>)/i.test(source)) problems.push(`${collection}/${name}: contains an unconverted <pre> block`);
}

if (posts.length < 200) problems.push(`expected at least 200 posts, found ${posts.length}`);
if (pages.length < 1) problems.push(`expected at least one page, found ${pages.length}`);

if (problems.length) {
	console.error(problems.join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Verified ${posts.length} posts and ${pages.length} pages.`);
}
