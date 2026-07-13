#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'data', 'assets-manifest.json'), 'utf8'));
const registered = new Set(manifest.files.map((file) => `/${file.key}`));

async function walk(directory) {
	const files = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...await walk(absolute));
		else if (entry.isFile() && /\.(?:md|mdx)$/.test(entry.name)) files.push(absolute);
	}
	return files;
}

const missing = new Map();
const sourceFiles = [
	...await walk(path.join(root, 'src', 'content')),
	path.join(root, 'src', 'data', 'site.json'),
];

for (const filename of sourceFiles) {
	const source = await readFile(filename, 'utf8');
	for (const match of source.matchAll(/(?<![A-Za-z0-9._~-])\/content\/[A-Za-z0-9_~!$&'()*+,;=:@%./-]+/g)) {
		let asset = match[0].replaceAll('&amp;', '&').split(/[?#]/, 1)[0].replace(/[),.;]+$/, '');
		try { asset = decodeURIComponent(asset); } catch { /* Retain the encoded path. */ }
		// Documentation may mention a content directory without referencing a file.
		if (asset.endsWith('/')) continue;
		if (!registered.has(asset)) {
			if (!missing.has(asset)) missing.set(asset, []);
			missing.get(asset).push(path.relative(root, filename));
		}
	}
}

if (missing.size) {
	for (const [asset, files] of missing) console.error(`${asset} (referenced by ${files.slice(0, 3).join(', ')})`);
	process.exitCode = 1;
} else {
	console.log(`Verified ${registered.size} registered R2 assets cover all content references.`);
}
