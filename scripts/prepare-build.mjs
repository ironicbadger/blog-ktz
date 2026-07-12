import { lstat, readlink, rm, unlink } from 'node:fs/promises';
import path from 'node:path';

const localContentLink = path.join('public', 'content');
const expectedTarget = path.join('..', 'assets-local', 'content');
const contentStats = await lstat(localContentLink).catch((error) => {
	if (error?.code === 'ENOENT') return null;
	throw error;
});

if (contentStats) {
	if (!contentStats.isSymbolicLink() || await readlink(localContentLink) !== expectedTarget) {
		throw new Error(`${localContentLink} exists but is not the expected local asset symlink`);
	}
	await unlink(localContentLink);
}

// Astro's content cache does not include PUBLIC_ASSET_BASE_URL in its cache key.
// Clear only generated caches so switching between local and R2 builds cannot
// leave stale asset URLs in rendered Markdown.
await Promise.all([
  rm('.astro', { recursive: true, force: true }),
  rm('node_modules/.astro', { recursive: true, force: true }),
]);
