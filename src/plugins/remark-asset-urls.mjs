import { visit } from 'unist-util-visit';
import responsiveImages from '../data/responsive-images.json' with { type: 'json' };
import honeymoonReport from '../../data/honeymoon-optimization-report.json' with { type: 'json' };

const ASSET_PATH = '/content/';

function assetBase() {
	return (process.env.PUBLIC_ASSET_BASE_URL ?? '').replace(/\/$/, '');
}

function rewriteUrl(value) {
	if (typeof value !== 'string' || value.length === 0) return value;

	let pathname = value;
	try {
		const parsed = new URL(value, 'https://blog.ktz.me');
		if (parsed.hostname !== 'blog.ktz.me' || !parsed.pathname.startsWith(ASSET_PATH)) {
			return value;
		}
		pathname = `${parsed.pathname}${parsed.search}${parsed.hash}`;
	} catch {
		return value;
	}

	return `${assetBase()}${pathname}`;
}

function contentPath(value) {
	if (typeof value !== 'string') return undefined;
	try {
		const parsed = new URL(value, 'https://blog.ktz.me');
		return parsed.pathname.startsWith(ASSET_PATH) ? parsed.pathname : undefined;
	} catch {
		return undefined;
	}
}

function attribute(tag, name) {
	const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
	return match?.[1] ?? match?.[2] ?? match?.[3];
}

function setAttribute(tag, name, value) {
	const escaped = String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');
	const pattern = new RegExp(`\\s${name}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`, 'i');
	if (pattern.test(tag)) return tag.replace(pattern, ` ${name}="${escaped}"`);
	return tag.replace(/\s*\/?>(?=$)/, (ending) => ` ${name}="${escaped}"${ending}`);
}

function responsiveHtml(html, responsiveImages, dimensions) {
	return html.replace(/<img\b[^>]*>/gi, (originalTag) => {
		const pathname = contentPath(attribute(originalTag, 'src'));
		if (!pathname) return originalTag;
		const candidates = responsiveImages[pathname] || [];
		const size = dimensions[pathname];
		let tag = originalTag;
		if (candidates.length) {
			tag = setAttribute(tag, 'srcset', candidates.map(({ src, width }) => `${src} ${width}w`).join(', '));
			tag = setAttribute(tag, 'sizes', attribute(tag, 'sizes') || '(min-width: 720px) 720px, 90vw');
		}
		if (size) {
			tag = setAttribute(tag, 'width', size.width);
			tag = setAttribute(tag, 'height', size.height);
		}
		return tag;
	});
}

function rewriteHtml(html) {
	return html
		.replace(/(?:https?:)?\/\/blog\.ktz\.me(\/content\/[^\s"'<>]+)/g, (_match, path) => rewriteUrl(path))
		.replace(/(^|["'\s,])\/content\//g, (_match, prefix) => `${prefix}${assetBase()}/content/`);
}

export default function remarkAssetUrls() {
	const dimensions = Object.fromEntries(
		(honeymoonReport.applied ? honeymoonReport.images || [] : []).map((image) => [image.ghostPath, image.after]),
	);
	return (tree) => {
		visit(tree, (node) => {
			if ((node.type === 'image' || node.type === 'definition' || node.type === 'link') && node.url) {
				const pathname = contentPath(node.url);
				const candidates = pathname ? responsiveImages[pathname] || [] : [];
				if (node.type === 'image' && candidates.length) {
					node.data ||= {};
					node.data.hProperties ||= {};
					node.data.hProperties.srcSet = candidates
						.map(({ src, width }) => `${rewriteUrl(src)} ${width}w`)
						.join(', ');
					node.data.hProperties.sizes = '(min-width: 720px) 720px, 90vw';
					if (dimensions[pathname]) {
						node.data.hProperties.width = dimensions[pathname].width;
						node.data.hProperties.height = dimensions[pathname].height;
					}
				}
				node.url = rewriteUrl(node.url);
			}
			if (node.type === 'html' && node.value) {
				node.value = rewriteHtml(responsiveHtml(node.value, responsiveImages, dimensions));
			}
		});
	};
}
