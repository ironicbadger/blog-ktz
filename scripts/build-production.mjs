#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const config = JSON.parse(await readFile(new URL('../deployment.config.json', import.meta.url), 'utf8'));
const child = spawn('npm', ['run', 'build'], {
	stdio: 'inherit',
	env: { ...process.env, PUBLIC_ASSET_BASE_URL: config.assetBaseUrl },
});

child.on('exit', (code) => process.exit(code ?? 1));
