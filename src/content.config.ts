import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const image = z.string().nullable().optional();

const author = z.object({
	name: z.string(),
	slug: z.string(),
	profileImage: image,
});

const seo = z.object({
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	image: image,
});

const shared = {
	title: z.string(),
	slug: z.string(),
	description: z.string().default(''),
	customExcerpt: z.string().nullable().optional(),
	publishedAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	featureImage: image,
	featureImageAlt: z.string().nullable().optional(),
	featureImageCaption: z.string().nullable().optional(),
	authors: z.array(author).default([]),
	canonicalUrl: z.string().nullable().optional(),
	seo: seo.optional(),
	ghostId: z.string(),
};

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: z.object({
		...shared,
		tags: z.array(z.string()).default([]),
		internalTags: z.array(z.string()).default([]),
		primaryTag: z.string().nullable().optional(),
		featured: z.boolean().default(false),
		readingTime: z.number().int().nonnegative().default(0),
	}),
});

const pages = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
	schema: z.object(shared),
});

export const collections = { posts, pages };
