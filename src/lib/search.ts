import type { IFuseOptions } from 'fuse.js';

export type SearchItem = {
	title: string;
	slug: string;
	description: string;
	tags: string[];
	tagLabels: string[];
	body: string;
};

export const SEARCH_OPTIONS: IFuseOptions<SearchItem> = {
	keys: [
		{ name: 'title', weight: 0.45 },
		{ name: 'tags', weight: 0.25 },
		{ name: 'tagLabels', weight: 0.25 },
		{ name: 'description', weight: 0.2 },
		{ name: 'body', weight: 0.1 },
	],
	threshold: 0.35,
	distance: 500,
	ignoreLocation: true,
	minMatchCharLength: 2,
	shouldSort: true,
	includeScore: true,
};
