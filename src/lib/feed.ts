import * as cheerio from 'cheerio';
import { assetUrl, SITE } from './site';

export function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function absoluteUrl(value?: string | null) {
	if (!value || /^(?:#|mailto:|tel:|data:|javascript:)/i.test(value)) return value || '';
	try {
		return new URL(assetUrl(value) || value, `${SITE.url}/`).toString();
	} catch {
		return value;
	}
}

export function absolutizeHtml(html = '') {
	const $ = cheerio.load(html, null, false);
	$('[src], [href], [poster]').each((_index, element) => {
		for (const attribute of ['src', 'href', 'poster']) {
			const value = $(element).attr(attribute);
			if (value) $(element).attr(attribute, absoluteUrl(value));
		}
	});
	$('[srcset]').each((_index, element) => {
		const srcset = $(element).attr('srcset');
		if (!srcset) return;
		$(element).attr(
			'srcset',
			srcset
				.split(',')
				.map((candidate) => {
					const [url, descriptor] = candidate.trim().split(/\s+/, 2);
					return `${absoluteUrl(url)}${descriptor ? ` ${descriptor}` : ''}`;
				})
				.join(', '),
		);
	});
	return $.html();
}

export function feedContent(html: string | undefined, featureImage?: string | null, alt = '') {
	const image = featureImage
		? `<img src="${escapeXml(absoluteUrl(featureImage))}" alt="${escapeXml(alt)}">`
		: '';
	return absolutizeHtml(`${image}${html || ''}`);
}

export function feedItemData(
	ghostId: string,
	authorName?: string,
	featureImage?: string | null,
) {
	const creator = authorName ? `<dc:creator>${escapeXml(authorName)}</dc:creator>` : '';
	const media = featureImage
		? `<media:content url="${escapeXml(absoluteUrl(featureImage))}" medium="image"/>`
		: '';
	return `<guid isPermaLink="false">${escapeXml(ghostId)}</guid>${creator}${media}`;
}

export function feedChannelData(feedPath: string, lastBuildDate: Date) {
	const feedUrl = new URL(feedPath, `${SITE.url}/`).toString();
	const icon = absoluteUrl(SITE.icon);
	const image = icon
		? `<image><url>${escapeXml(icon)}</url><title>${escapeXml(SITE.title)}</title><link>${escapeXml(`${SITE.url}/`)}</link></image>`
		: '';
	return (
		`<language>en-us</language>${image}` +
		`<generator>Astro</generator>` +
		`<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>` +
		`<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>` +
		'<ttl>60</ttl>'
	);
}

export const feedNamespaces = {
	dc: 'http://purl.org/dc/elements/1.1/',
	atom: 'http://www.w3.org/2005/Atom',
	media: 'http://search.yahoo.com/mrss/',
};
