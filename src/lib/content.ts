import type { CollectionEntry } from 'astro:content';
import tags from '../data/tags.json';

export type Post = CollectionEntry<'posts'>;
export type ContentPage = CollectionEntry<'pages'>;
export type ArchiveTag = {
	name: string;
	slug: string;
	description: string | null;
	feature_image: string | null;
	meta_title: string | null;
	meta_description: string | null;
};
export const POSTS_PER_PAGE = 25;

export function sortPosts(posts: Post[]) {
	return [...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function sitePosts(posts: Post[]) {
	const visible = import.meta.env.PROD ? posts.filter((post) => !post.data.drafts) : posts;
	return sortPosts(visible);
}

export function postsWithTag(posts: Post[], tag: string) {
	return posts.filter((post) => post.data.tags.includes(tag));
}

export function postsByAuthor(posts: Post[], author: string) {
	return posts.filter((post) => post.data.authors.some(({ slug }) => slug === author));
}

export function pageCount(items: unknown[]) {
	return Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
}

export function pageSlice<T>(items: T[], page: number) {
	const start = (page - 1) * POSTS_PER_PAGE;
	return items.slice(start, start + POSTS_PER_PAGE);
}

export function publicTags() {
	return tags.filter((tag) => tag.visibility === 'public' && !tag.name.startsWith('#') && tag.count?.posts > 0);
}

export function archiveTags(posts: Post[]) {
	const configured = publicTags();
	const bySlug = new Map<string, ArchiveTag>(configured.map((tag) => [tag.slug, tag]));

	for (const slug of new Set(posts.flatMap((post) => post.data.tags))) {
		if (bySlug.has(slug)) continue;
		bySlug.set(slug, {
			name: slug,
			slug,
			description: null,
			feature_image: null,
			meta_title: null,
			meta_description: null,
		});
	}

	return [...bySlug.values()].filter((tag) => postsWithTag(posts, tag.slug).length > 0);
}

export function tagDetails(slug: string) {
	return publicTags().find((tag) => tag.slug === slug);
}
