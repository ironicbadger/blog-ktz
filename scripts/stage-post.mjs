#!/usr/bin/env node

import { spawn } from 'node:child_process';

function run(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: 'inherit',
			env: process.env,
		});
		child.on('error', reject);
		child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
	});
}

for (const script of [
	'assets:responsive',
	'content:verify',
	'assets:manifest',
	'assets:registry:verify',
	'assets:verify',
	'build:production',
]) {
	await run('npm', ['run', script]);
}

// Upload only after every local pre-flight check and the production build pass.
await run('npm', ['run', 'assets:upload']);

console.log('\nAssets and production build are ready for a local Git commit.');
