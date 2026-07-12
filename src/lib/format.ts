import { SITE } from './site';

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
	day: 'numeric',
	month: 'short',
	timeZone: SITE.timezone,
	year: 'numeric',
});

export function formatDate(date: Date) {
	return dateFormatter.format(date);
}

export function readingTime(minutes: number) {
	return `${Math.max(1, minutes)} min read`;
}
