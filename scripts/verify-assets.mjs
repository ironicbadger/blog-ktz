#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'src', 'content');
const assetRoot = path.join(root, 'assets-local', 'content');

async function walk(directory) {
	const files = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolute)));
		else if (entry.isFile() && /\.(?:md|mdx)$/.test(entry.name)) files.push(absolute);
	}
	return files;
}

function referencedAssets(source) {
	const paths = new Set();
	for (const match of source.matchAll(/(?<![A-Za-z0-9._~-])\/content\/[A-Za-z0-9_~!$&'()*+,;=:@%./-]+/g)) {
		let normalized = match[0]
			.replaceAll('&amp;', '&')
			.split(/[?#]/, 1)[0]
			.replace(/[),.;]+$/, '');
		try {
			normalized = decodeURIComponent(normalized);
		} catch { /* Retain the encoded path. */ }
		// Documentation may mention a content directory without referencing a file.
		if (!normalized.endsWith('/')) paths.add(normalized);
	}
	return paths;
}

const references = new Map();
const sourceFiles = [
	...(await walk(sourceRoot)),
	path.join(root, 'src', 'data', 'site.json'),
];
for (const filename of sourceFiles) {
	const source = await readFile(filename, 'utf8');
	for (const asset of referencedAssets(source)) {
		if (!references.has(asset)) references.set(asset, []);
		references.get(asset).push(path.relative(root, filename));
	}
}

const missing = [];
for (const [asset, files] of references) {
	const relative = asset.replace(/^\/content\//, '');
	try {
		await access(path.join(assetRoot, relative));
	} catch {
		missing.push(`${asset} (referenced by ${files.slice(0, 3).join(', ')})`);
	}
}

if (missing.length) {
	console.error(`Missing ${missing.length} referenced assets:\n${missing.join('\n')}`);
	process.exitCode = 1;
} else {
	console.log(`Verified ${references.size} unique local asset references.`);
}
