import type Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';
import type { SearchItem } from './search';

const queryTerms = (query: string) =>
	Array.from(new Set(query.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)))
		.sort((left, right) => right.length - left.length);

const appendHighlightedText = (element: HTMLElement, text: string, query: string) => {
	const terms = queryTerms(query);
	const lowercase = text.toLocaleLowerCase();
	let cursor = 0;

	while (cursor < text.length) {
		let matchIndex = -1;
		let matchLength = 0;
		for (const term of terms) {
			const index = lowercase.indexOf(term, cursor);
			if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
				matchIndex = index;
				matchLength = term.length;
			}
		}

		if (matchIndex === -1) {
			element.append(document.createTextNode(text.slice(cursor)));
			break;
		}
		if (matchIndex > cursor) element.append(document.createTextNode(text.slice(cursor, matchIndex)));
		const mark = document.createElement('mark');
		mark.textContent = text.slice(matchIndex, matchIndex + matchLength);
		element.append(mark);
		cursor = matchIndex + matchLength;
	}
};

const matchedSnippet = (item: SearchItem, query: string, maximumLength = 240) => {
	const source = [item.description, item.body].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
	if (!source) return 'Open post';

	const lowercase = source.toLocaleLowerCase();
	const indexes = queryTerms(query)
		.map((term) => lowercase.indexOf(term))
		.filter((index) => index >= 0);
	const anchor = indexes.length ? Math.min(...indexes) : 0;
	let start = Math.max(0, anchor - 70);
	if (start > 0) {
		const nextSpace = source.indexOf(' ', start);
		if (nextSpace !== -1) start = nextSpace + 1;
	}
	let end = Math.min(source.length, start + maximumLength);
	if (end < source.length) {
		const lastSpace = source.lastIndexOf(' ', end);
		if (lastSpace > start) end = lastSpace;
	}

	return `${start > 0 ? '…' : ''}${source.slice(start, end)}${end < source.length ? '…' : ''}`;
};

export const sortByRelevance = (results: FuseResult<SearchItem>[]) =>
	results.sort((left, right) => (left.score ?? 1) - (right.score ?? 1));

export const searchByRelevance = (fuse: Fuse<SearchItem>, query: string) =>
	sortByRelevance(fuse.search(query));

interface SearchKeyboardOptions {
	input: HTMLInputElement;
	getLinks: () => HTMLAnchorElement[];
	reopen: () => void;
	reset: () => void;
}

export const installSearchKeyboardNavigation = ({ input, getLinks, reopen, reset }: SearchKeyboardOptions) => {
	input.setAttribute('aria-keyshortcuts', 'Meta+K Control+K');
	document.addEventListener('keydown', (event) => {
		const key = event.key.toLocaleLowerCase();
		if ((event.metaKey || event.ctrlKey) && !event.altKey && key === 'k') {
			event.preventDefault();
			input.focus();
			input.select();
			reopen();
			return;
		}

		const links = getLinks();
		if (event.target === input && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
			if (!links.length) return;
			event.preventDefault();
			links[event.key === 'ArrowDown' ? 0 : links.length - 1].focus();
			return;
		}

		const activeLink = event.target instanceof HTMLAnchorElement ? event.target : null;
		const activeIndex = activeLink ? links.indexOf(activeLink) : -1;
		if (!activeLink || activeIndex === -1) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			reset();
			input.focus();
			return;
		}
		if (event.key === 'Enter') {
			event.preventDefault();
			activeLink.click();
			return;
		}
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

		event.preventDefault();
		const direction = event.key === 'ArrowDown' ? 1 : -1;
		const nextIndex = (activeIndex + direction + links.length) % links.length;
		links[nextIndex].focus();
	});
};

export const renderSearchResult = (
	item: SearchItem,
	query: string,
	iconTemplate?: HTMLTemplateElement | null,
) => {
	const entry = document.createElement('li');
	const link = document.createElement('a');
	const copy = document.createElement('span');
	const title = document.createElement('strong');
	const tags = document.createElement('span');
	const excerpt = document.createElement('span');

	link.href = `/${item.slug}/`;
	link.className = 'search-result-link';
	copy.className = 'search-result-copy';
	title.className = 'search-result-title';
	tags.className = 'search-result-tags';
	excerpt.className = 'search-result-excerpt';
	appendHighlightedText(title, item.title, query);
	appendHighlightedText(tags, item.tagLabels.slice(0, 5).join(' · ') || 'post', query);
	appendHighlightedText(excerpt, matchedSnippet(item, query), query);

	if (iconTemplate) link.append(iconTemplate.content.cloneNode(true));
	copy.append(title, tags, excerpt);
	link.append(copy);
	entry.append(link);
	return entry;
};
