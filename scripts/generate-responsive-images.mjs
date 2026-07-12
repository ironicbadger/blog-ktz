#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sizeRoot = path.join(root, 'assets-local', 'content', 'images', 'size');
const output = path.join(root, 'src', 'data', 'responsive-images.json');
const manifest = {};

async function walk(directory) {
	const files = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolute)));
		else if (entry.isFile()) files.push(absolute);
	}
	return files;
}

for (const absolute of await walk(sizeRoot)) {
	const relative = path.relative(sizeRoot, absolute).split(path.sep).join('/');
	const match = relative.match(/^w(\d+)\/(.+)$/);
	if (!match) continue;
	const [, width, imagePath] = match;
	const original = `/content/images/${imagePath}`;
	const candidate = { width: Number(width), src: `/content/images/size/w${width}/${imagePath}` };
	(manifest[original] ||= []).push(candidate);
}

for (const candidates of Object.values(manifest)) {
	candidates.sort((a, b) => a.width - b.width);
}

// The honeymoon renderer intentionally uses WebP derivatives while retaining
// each legacy original URL. Its report provides the original -> derivative
// relationship that cannot be inferred from filenames alone.
const honeymoonReport = path.join(root, 'data', 'honeymoon-optimization-report.json');
try {
	const report = JSON.parse(await readFile(honeymoonReport, 'utf8'));
	if (report.applied) {
		for (const image of report.images || []) {
			manifest[image.ghostPath] = (image.responsive || []).map(({ width, path: src }) => ({ width, src }));
		}
	}
} catch (error) {
	if (error?.code !== 'ENOENT') throw error;
}

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Indexed responsive variants for ${Object.keys(manifest).length} images.`);
