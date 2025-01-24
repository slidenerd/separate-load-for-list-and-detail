import { getFilterSearchQueryString, toUrlFriendly } from '$lib/functions';
import type { NewsFilter } from '$lib/types/NewsFilter';

export function getNewsDetailEndpoint(
	filter: NewsFilter,
	id: string | undefined,
	search: string,
	title: string | undefined
) {
	const queryString = getFilterSearchQueryString(filter, search);
	const baseUrl = `/news`;

	if (queryString) {
		return `${baseUrl}/${id}/${toUrlFriendly(title as string)}/?${queryString}`;
	} else {
		return `${baseUrl}/${id}/${toUrlFriendly(title as string)}`;
	}
}

export function getNewsListEndpoint(filter: NewsFilter, search: string) {
	const queryString = getFilterSearchQueryString(filter, search);
	const baseUrl = `/news`;

	if (queryString) {
		return `${baseUrl}/?${queryString}`;
	} else {
		return baseUrl;
	}
}
