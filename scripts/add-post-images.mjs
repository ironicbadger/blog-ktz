#!/usr/bin/env node

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const feature = args.includes('--feature');
const positional = args.filter((arg) => arg !== '--feature');
const [slug, ...inputFiles] = positional;

if (!slug || inputFiles.length === 0) {
	console.error('Usage: npm run post:image -- <post-slug> <image> [image ...] [--feature]');
	process.exit(1);
}

const root = process.cwd();
const postPath = path.join(root, 'src', 'content', 'posts', `${slug}.md`);
let post = await readFile(postPath, 'utf8');
const publishedAt = post.match(/^publishedAt:\s*(.+)$/m)?.[1];
const published = publishedAt ? new Date(publishedAt) : new Date();
if (Number.isNaN(published.valueOf())) throw new Error(`Invalid publishedAt in ${postPath}`);

const [, year, month] = publishedAt?.match(/^(\d{4})-(\d{2})/) || [null, String(published.getFullYear()), String(published.getMonth() + 1).padStart(2, '0')];
const relativeDirectory = path.posix.join(year, month, slug);
const originalDirectory = path.join(root, 'assets-local', 'content', 'images', relativeDirectory);
const responsiveWidths = [600, 1000, 1600];
const created = [];

function safeStem(filename) {
	return path.basename(filename, path.extname(filename))
		.normalize('NFKD')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '') || 'image';
}

await mkdir(originalDirectory, { recursive: true });

for (const input of inputFiles) {
	await access(input);
	const stem = safeStem(input);
	const filename = `${stem}.webp`;
	const originalPath = path.join(originalDirectory, filename);
	const pipeline = sharp(input).rotate();
	const metadata = await pipeline.metadata();

	await pipeline
		.clone()
		.resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 88, effort: 5 })
		.toFile(originalPath);

	for (const width of responsiveWidths) {
		if (metadata.width && metadata.width <= width) continue;
		const outputDirectory = path.join(root, 'assets-local', 'content', 'images', 'size', `w${width}`, relativeDirectory);
		await mkdir(outputDirectory, { recursive: true });
		await pipeline
			.clone()
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: 84, effort: 5 })
			.toFile(path.join(outputDirectory, filename));
	}

	const publicPath = `/content/images/${relativeDirectory}/${filename}`;
	created.push(publicPath);
	console.log(`![Describe this image](${publicPath})`);
}

if (feature) {
	post = post.replace(/^featureImage:.*$/m, `featureImage: ${created[0]}`);
	await writeFile(postPath, post);
	console.log(`Set ${created[0]} as the feature image for ${slug}.`);
}

console.log('Run just publish when the post is ready.');
