import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPosts } from '../lib/content';
import { feedChannelData, feedContent, feedItemData, feedNamespaces } from '../lib/feed';
import { SITE } from '../lib/site';

export async function GET(context: { site: URL | undefined }) {
	const posts = sortPosts(await getCollection('posts')).slice(0, 15);
	return rss({
		title: SITE.title,
		description: SITE.description,
		site: context.site || SITE.url,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishedAt,
			link: `/${post.data.slug}/`,
			content: feedContent(
				post.rendered?.html,
				post.data.featureImage,
				post.data.featureImageAlt || post.data.title,
			),
			categories: post.data.tags,
			customData: feedItemData(
				post.data.ghostId,
				post.data.authors[0]?.name,
				post.data.featureImage,
			),
		})),
		xmlns: feedNamespaces,
		customData: feedChannelData('/rss/', posts[0]?.data.updatedAt || new Date()),
	});
}
