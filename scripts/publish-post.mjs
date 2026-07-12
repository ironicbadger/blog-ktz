#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const config = JSON.parse(await readFile(new URL('../deployment.config.json', import.meta.url), 'utf8'));

function run(command, args, env = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: 'inherit',
			env: { ...process.env, ...env },
		});
		child.on('error', reject);
		child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
	});
}

for (const script of ['assets:responsive', 'content:verify', 'assets:verify', 'assets:upload']) {
	await run('npm', ['run', script]);
}
await run('npm', ['run', 'build'], { PUBLIC_ASSET_BASE_URL: config.assetBaseUrl });

console.log('\nPost and assets are production-ready. Review the diff, commit the Markdown and responsive index, then push.');
