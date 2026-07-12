#!/usr/bin/env node

import { lstat, mkdir, readlink, symlink } from 'node:fs/promises';
import path from 'node:path';

const link = path.join('public', 'content');
const target = path.join('..', 'assets-local', 'content');
const stats = await lstat(link).catch((error) => {
	if (error?.code === 'ENOENT') return null;
	throw error;
});

if (!stats) {
	await mkdir(path.dirname(link), { recursive: true });
	await symlink(target, link, 'dir');
} else if (!stats.isSymbolicLink() || await readlink(link) !== target) {
	throw new Error(`${link} exists but is not the expected local asset symlink`);
}
