import type { NewsFilter } from '$lib/types/NewsFilter';

export function getFilterSearchQueryString(filter: NewsFilter, search: string) {
	const query = new URLSearchParams();
	if (isValidFilter(filter)) {
		query.set('filter', filter);
	}
	if (isValidSearch(search)) {
		query.set('search', search);
	}
	return query.toString();
}

export function isDetailRoute(id: string | undefined, title: string | undefined) {
	return (
		typeof id !== 'undefined' &&
		id !== null &&
		isValidId(id) &&
		typeof title !== 'undefined' &&
		title !== null &&
		title.trim().length > 0
	);
}

export function isValidId(value: string) {
	return /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(
		value
	);
}

// https://www.30secondsofcode.org/js/s/is-iso-formatted-date/
export function isValidISODate(value: string) {
	const d = new Date(value);
	return !Number.isNaN(d.valueOf()) && d.toISOString() === value;
}

export function isValidSearch(value: string) {
	return typeof value === 'string' && value.trim().length > 0;
}

export function isValidString(value: string) {
	return typeof value !== 'undefined' && value !== null && value.trim().length > 0;
}

export function isValidFilter(value: NewsFilter) {
	return ['likes', 'dislikes', 'latest', 'trending'].includes(value);
}

export function toUrlFriendly(text: string) {
	return typeof text === 'string'
		? text
				.trim()
				.replace(/[\W_]+/g, '-')
				.toLowerCase()
		: '';
}
