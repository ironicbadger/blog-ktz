#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const title = args.find((arg) => !arg.startsWith('--'));
const tagsArgument = args.find((arg) => arg.startsWith('--tags='))?.slice('--tags='.length) || '';

if (!title) {
	console.error('Usage: npm run post:new -- "Post title" [--tags=technical,hardware]');
	process.exit(1);
}

const slug = title
	.normalize('NFKD')
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-|-$/g, '');
const tags = tagsArgument.split(',').map((tag) => tag.trim()).filter(Boolean);

function localIso(date) {
	const offset = -date.getTimezoneOffset();
	const sign = offset >= 0 ? '+' : '-';
	const two = (value) => String(Math.abs(value)).padStart(2, '0');
	return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`
		+ `T${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`
		+ `${sign}${two(Math.trunc(offset / 60))}:${two(offset % 60)}`;
}

const now = localIso(new Date());
const postDirectory = path.join(process.cwd(), 'src', 'content', 'posts');
const filename = path.join(postDirectory, `${slug}.md`);
const yamlTags = tags.length ? `\n${tags.map((tag) => `  - ${tag}`).join('\n')}` : ' []';
const primaryTag = tags[0] ? tags[0] : 'null';

const source = `---
title: ${JSON.stringify(title)}
slug: ${slug}
description: ""
customExcerpt: null
publishedAt: ${now}
updatedAt: ${now}
featureImage: null
featureImageAlt: null
featureImageCaption: null
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: local-${randomUUID()}
tags:${yamlTags}
internalTags: []
primaryTag: ${primaryTag}
featured: false
readingTime: 0
drafts: true
---

Write here.
`;

await mkdir(postDirectory, { recursive: true });
try {
	await writeFile(filename, source, { flag: 'wx' });
} catch (error) {
	if (error?.code === 'EEXIST') console.error(`Post already exists: ${filename}`);
	else console.error(error);
	process.exit(1);
}

console.log(path.relative(process.cwd(), filename));
