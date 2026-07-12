// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import icon from 'astro-icon';
import { fileURLToPath } from 'node:url';
import remarkAssetUrls from './src/plugins/remark-asset-urls.mjs';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.ktz.me',
	output: 'static',
	trailingSlash: 'always',
	integrations: [
		mdx(),
		sitemap(),
		icon({
			include: {
				'simple-icons': ['github', 'linkedin', 'podcastindex', 'x', 'youtube'],
			},
		}),
	],
	markdown: {
		processor: unified({ remarkPlugins: [remarkAssetUrls] }),
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
			wrap: false,
			langAlias: {
				conf: 'ini',
				console: 'shellsession',
				docker: 'dockerfile',
				js: 'javascript',
				sh: 'bash',
				yml: 'yaml',
			},
		},
	},
	vite: {
		server: {
			fs: {
				allow: [projectRoot, '/node_modules'],
			},
		},
	},
});
