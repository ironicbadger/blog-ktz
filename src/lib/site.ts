import settings from '../data/site.json';
import responsiveImages from '../data/responsive-images.json';

const assetBase = (import.meta.env.PUBLIC_ASSET_BASE_URL || '').replace(/\/$/, '');
const canonicalHost = new URL(settings.url).hostname;
const navigation = settings.navigation.some((item) => item.url === '/archive/')
	? settings.navigation
	: [...settings.navigation, { label: 'Archive', url: '/archive/' }];

export const SITE = {
	title: settings.title,
	metaTitle: settings.meta_title || settings.title,
	description: settings.description,
	url: settings.url.replace(/\/$/, ''),
	locale: settings.locale || 'en',
	timezone: settings.timezone || 'America/New_York',
	accentColor: settings.accent_color || '#3eb0ef',
	coverImage: settings.cover_image,
	icon: settings.icon,
	navigation,
	secondaryNavigation: settings.secondary_navigation,
};

export function assetUrl(value?: string | null) {
	if (!value) return undefined;
	try {
		const parsed = new URL(value, SITE.url);
		if (parsed.hostname === canonicalHost && parsed.pathname.startsWith('/content/')) {
			return `${assetBase}${parsed.pathname}${parsed.search}${parsed.hash}`;
		}
		return value;
	} catch {
		return value;
	}
}

function localContentPath(value?: string | null) {
	if (!value) return undefined;
	try {
		const parsed = new URL(value, SITE.url);
		return parsed.hostname === canonicalHost && parsed.pathname.startsWith('/content/') ? parsed.pathname : undefined;
	} catch {
		return undefined;
	}
}

export function responsiveImage(value?: string | null) {
	const src = assetUrl(value);
	const pathname = localContentPath(value);
	const candidates = pathname
		? (responsiveImages as Record<string, Array<{ width: number; src: string }>>)[pathname] || []
		: [];
	return {
		src,
		srcset: candidates.length
			? candidates.map((candidate) => `${assetUrl(candidate.src)} ${candidate.width}w`).join(', ')
			: undefined,
	};
}

export function canonicalUrl(pathname: string) {
	return new URL(pathname, `${SITE.url}/`).toString();
}
