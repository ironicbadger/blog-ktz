#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, open, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_SOURCE = 'assets-local/content';
const DEFAULT_OUTPUT = '.r2/assets-manifest.json';
const DEFAULT_PREFIX = 'content/';
const DEFAULT_CONCURRENCY = 3;
const CACHE_CONTROL = 'public,max-age=2592000,stale-while-revalidate=86400';

const MIME_TYPES = new Map([
	['.avif', 'image/avif'],
	['.css', 'text/css; charset=utf-8'],
	['.gif', 'image/gif'],
	['.heic', 'image/heic'],
	['.htm', 'text/html; charset=utf-8'],
	['.html', 'text/html; charset=utf-8'],
	['.ico', 'image/x-icon'],
	['.jpeg', 'image/jpeg'],
	['.jpg', 'image/jpeg'],
	['.js', 'text/javascript; charset=utf-8'],
	['.json', 'application/json; charset=utf-8'],
	['.m4a', 'audio/mp4'],
	['.mov', 'video/quicktime'],
	['.mp3', 'audio/mpeg'],
	['.mp4', 'video/mp4'],
	['.pdf', 'application/pdf'],
	['.png', 'image/png'],
	['.svg', 'image/svg+xml'],
	['.txt', 'text/plain; charset=utf-8'],
	['.webm', 'video/webm'],
	['.webp', 'image/webp'],
	['.woff', 'font/woff'],
	['.woff2', 'font/woff2'],
	['.xml', 'application/xml; charset=utf-8'],
]);

function usage() {
	console.log(`Prepare the mirrored Ghost asset tree for Cloudflare R2.

Usage:
  node scripts/prepare-r2-assets.mjs [options]

Options:
  --source <directory>  Asset directory to scan (default: ${DEFAULT_SOURCE})
  --output <file>       Manifest destination (default: ${DEFAULT_OUTPUT})
  --prefix <prefix>     R2 object-key prefix (default: ${DEFAULT_PREFIX})
  --upload              Run a non-deleting, checksum-aware R2 sync
  --dry-run             Show which R2 objects would be uploaded (requires --upload)
  --concurrency <count> Parallel R2 uploads (default: ${DEFAULT_CONCURRENCY})
  --help                Show this help

Upload environment:
  CLOUDFLARE_API_TOKEN may provide authentication. Otherwise the uploader uses
  the current Wrangler login. R2_ACCOUNT_ID and R2_BUCKET override the committed
  non-secret deployment configuration.
`);
}

function valueAfter(args, index, option) {
	const value = args[index + 1];
	if (!value || value.startsWith('--')) {
		throw new Error(`${option} requires a value`);
	}
	return value;
}

function parseArgs(args) {
	const options = {
		source: DEFAULT_SOURCE,
		output: DEFAULT_OUTPUT,
		prefix: DEFAULT_PREFIX,
		upload: false,
		dryRun: false,
		concurrency: DEFAULT_CONCURRENCY,
	};

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		switch (arg) {
			case '--source':
				options.source = valueAfter(args, index, arg);
				index += 1;
				break;
			case '--output':
				options.output = valueAfter(args, index, arg);
				index += 1;
				break;
			case '--prefix':
				options.prefix = valueAfter(args, index, arg);
				index += 1;
				break;
			case '--upload':
				options.upload = true;
				break;
			case '--dry-run':
				options.dryRun = true;
				break;
			case '--concurrency':
				options.concurrency = Number(valueAfter(args, index, arg));
				index += 1;
				break;
			case '--help':
				options.help = true;
				break;
			default:
				throw new Error(`Unknown option: ${arg}`);
		}
	}

	if (options.dryRun && !options.upload) {
		throw new Error('--dry-run must be used with --upload');
	}
	if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 32) {
		throw new Error('--concurrency must be an integer between 1 and 32');
	}

	return options;
}

function toPosix(value) {
	return value.split(path.sep).join('/');
}

function normalizePrefix(value) {
	const normalized = value.replace(/^\/+|\/+$/g, '');
	return normalized ? `${normalized}/` : '';
}

async function listFiles(directory) {
	const files = [];

	async function visit(current) {
		const entries = await readdir(current, { withFileTypes: true });
		entries.sort((a, b) => a.name.localeCompare(b.name));

		for (const entry of entries) {
			// Ignore editor, filesystem, and atomic-write scratch files. None should
			// become public R2 objects.
			if (entry.name.startsWith('.')) continue;

			const absolutePath = path.join(current, entry.name);
			if (entry.isDirectory()) {
				await visit(absolutePath);
			} else if (entry.isFile()) {
				files.push(absolutePath);
			} else {
				throw new Error(`Unsupported non-file asset: ${absolutePath}`);
			}
		}
	}

	await visit(directory);
	return files;
}

async function hashes(filePath) {
	const sha256 = createHash('sha256');
	const md5 = createHash('md5');
	for await (const chunk of createReadStream(filePath)) {
		sha256.update(chunk);
		md5.update(chunk);
	}
	return { sha256: sha256.digest('hex'), etag: md5.digest('hex') };
}

async function contentType(filePath) {
	const byExtension = MIME_TYPES.get(path.extname(filePath).toLowerCase());
	if (byExtension) return byExtension;

	const header = Buffer.alloc(16);
	const handle = await open(filePath, 'r');
	let bytesRead;
	try {
		({ bytesRead } = await handle.read(header, 0, header.length, 0));
	} finally {
		await handle.close();
	}
	const bytes = header.subarray(0, bytesRead);
	if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
		return 'image/png';
	}
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
	if (bytes.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/)) return 'image/gif';
	if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') {
		return 'image/webp';
	}
	return 'application/octet-stream';
}

async function makeManifest(source, prefix) {
	const absoluteSource = path.resolve(source);
	const sourceStats = await stat(absoluteSource).catch(() => null);
	if (!sourceStats?.isDirectory()) {
		throw new Error(`Asset source is not a directory: ${source}`);
	}

	const paths = await listFiles(absoluteSource);
	const files = [];
	let totalBytes = 0;

	for (const [index, absolutePath] of paths.entries()) {
		const relativePath = toPosix(path.relative(absoluteSource, absolutePath));
		const fileStats = await stat(absolutePath);
		const fileHashes = await hashes(absolutePath);
		totalBytes += fileStats.size;
		files.push({
			key: `${prefix}${relativePath}`,
			size: fileStats.size,
			...fileHashes,
			contentType: await contentType(absolutePath),
			cacheControl: CACHE_CONTROL,
		});

		if ((index + 1) % 100 === 0) {
			process.stdout.write(`Hashed ${index + 1}/${paths.length} assets\r`);
		}
	}

	if (paths.length >= 100) process.stdout.write(' '.repeat(48) + '\r');

	return {
		version: 1,
		generatedAt: new Date().toISOString(),
		source: toPosix(path.relative(process.cwd(), absoluteSource)) || '.',
		prefix,
		assetCount: files.length,
		totalBytes,
		files,
	};
}

function capture(command, args, env) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { env, stdio: ['ignore', 'pipe', 'pipe'] });
		let stdout = '';
		let stderr = '';
		child.stdout.setEncoding('utf8');
		child.stderr.setEncoding('utf8');
		child.stdout.on('data', (chunk) => { stdout += chunk; });
		child.stderr.on('data', (chunk) => { stderr += chunk; });
		child.once('error', reject);
		child.once('exit', (code, signal) => {
			if (signal) reject(new Error(`${command} terminated by ${signal}`));
			else if (code !== 0) reject(new Error(`${command} exited with status ${code}: ${stderr.trim()}`));
			else resolve(stdout);
		});
	});
}

function encodeObjectKey(key) {
	return key.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

async function cloudflareToken() {
	if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
	const raw = await capture('npx', ['wrangler', 'auth', 'token', '--json'], process.env);
	const credentials = JSON.parse(raw);
	if (!credentials.token) throw new Error('Wrangler did not return an authentication token');
	return credentials.token;
}

async function cloudflareRequest(url, token, init = {}, attempts = 12) {
	let lastError;
	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		try {
			const response = await fetch(url, {
				...init,
				headers: { Authorization: `Bearer ${token}`, ...init.headers },
			});
			if (response.ok) return response;
			const detail = await response.text();
			if (response.status !== 429 && response.status < 500) {
				throw new Error(`Cloudflare API ${response.status}: ${detail}`);
			}
			lastError = new Error(`Cloudflare API ${response.status}: ${detail}`);
			const retryAfter = Number(response.headers.get('retry-after'));
			if (Number.isFinite(retryAfter) && retryAfter > 0 && attempt < attempts) {
				await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
				continue;
			}
		} catch (error) {
			lastError = error;
		}
		if (attempt < attempts) {
			await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * (2 ** (attempt - 1)), 60000)));
		}
	}
	throw lastError;
}

async function listRemoteObjects(accountId, bucket, prefix, token) {
	const objects = new Map();
	let cursor;
	do {
		const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects`);
		url.searchParams.set('prefix', prefix);
		url.searchParams.set('per_page', '1000');
		if (cursor) url.searchParams.set('cursor', cursor);
		const response = await cloudflareRequest(url, token);
		const payload = await response.json();
		if (!payload.success) throw new Error(`Could not list R2 objects: ${JSON.stringify(payload.errors)}`);
		for (const object of payload.result || []) objects.set(object.key, object);
		cursor = payload.result_info?.is_truncated ? payload.result_info.cursor : undefined;
	} while (cursor);
	return objects;
}

async function upload(options, prefix, manifest, deployment) {
	const accountId = process.env.R2_ACCOUNT_ID || deployment.cloudflareAccountId;
	const bucket = process.env.R2_BUCKET || deployment.r2Bucket;
	if (!accountId || !bucket) throw new Error('--upload requires an R2 account ID and bucket');

	const token = await cloudflareToken();
	const remote = await listRemoteObjects(accountId, bucket, prefix, token);
	const pending = manifest.files.filter((file) => {
		const existing = remote.get(file.key);
		return !existing
			|| existing.size !== file.size
			|| existing.etag !== file.etag
			|| existing.http_metadata?.contentType !== file.contentType
			|| existing.http_metadata?.cacheControl !== file.cacheControl;
	});
	console.log(`${pending.length} of ${manifest.files.length} assets need uploading to r2://${bucket}/${prefix}`);
	if (options.dryRun || pending.length === 0) return;

	let next = 0;
	let completed = 0;
	const source = path.resolve(options.source);
	async function worker() {
		while (next < pending.length) {
			const file = pending[next];
			next += 1;
			const relativeKey = file.key.slice(prefix.length);
			const body = await readFile(path.join(source, relativeKey));
			const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects/${encodeObjectKey(file.key)}`;
			const response = await cloudflareRequest(url, token, {
				method: 'PUT',
				headers: {
					'Content-Type': file.contentType,
					'Cache-Control': file.cacheControl,
					'Content-Length': String(file.size),
				},
				body,
			});
			const payload = await response.json();
			if (!payload.success) throw new Error(`Could not upload ${file.key}: ${JSON.stringify(payload.errors)}`);
			completed += 1;
			if (completed % 25 === 0 || completed === pending.length) {
				console.log(`Uploaded ${completed}/${pending.length} assets`);
			}
		}
	}
	await Promise.all(Array.from({ length: Math.min(options.concurrency, pending.length) }, () => worker()));
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	if (options.help) {
		usage();
		return;
	}

	const prefix = normalizePrefix(options.prefix);
	const deployment = JSON.parse(await readFile(path.join(process.cwd(), 'deployment.config.json'), 'utf8'));
	const manifest = await makeManifest(options.source, prefix);
	const output = path.resolve(options.output);
	await mkdir(path.dirname(output), { recursive: true });
	await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);

	const mebibytes = (manifest.totalBytes / (1024 * 1024)).toFixed(1);
	console.log(`Wrote ${manifest.assetCount} assets (${mebibytes} MiB) to ${options.output}`);

	if (options.upload) await upload(options, prefix, manifest, deployment);
}

main().catch((error) => {
	console.error(`R2 preparation failed: ${error.message}`);
	process.exitCode = 1;
});
