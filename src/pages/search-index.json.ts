import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { sitePosts, tagDetails } from '../lib/content';

function plainText(source = '') {
	return source
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[`*_>#|~-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export const GET: APIRoute = async () => {
	const posts = sitePosts(await getCollection('posts'));
	return new Response(
		JSON.stringify(
			posts.map((post) => ({
				title: post.data.title,
				slug: post.data.slug,
				description: post.data.description,
				tags: post.data.tags,
				tagLabels: post.data.tags.map((tag) => tagDetails(tag)?.name || tag),
				body: plainText(post.body),
			})),
		),
		{ headers: { 'content-type': 'application/json; charset=utf-8' } },
	);
};
