import { API_BASE_URL } from '$lib/config';
import {
	getFilterSearchQueryString,
	isValidFilter,
	isValidId,
	isValidISODate,
	isValidSearch
} from '$lib/functions';
import type { NewsFilter } from '$lib/types/NewsFilter';

// ========================================GET ONLY NEWS ITEM========================================
// This endpoint retrieves just a single news item
// ==================================================================================================
export function getNewsItemEndpoint(id: string) {
	return `${API_BASE_URL}/api/v1/news/item/${id}`;
}

// ========================================GET NEWS LIST========================================
// This endpoint retrieves a list of items for given criteria but only the first page
// Since we use infinite scroll, subsequent pages need a cursor
// ==================================================================================================

export function getNewsListFirstPageEndpoint(filter: NewsFilter, search: string) {
	const queryString = getFilterSearchQueryString(filter, search);
	const baseUrl = `${API_BASE_URL}/api/v1/news/list/latest`;
	if (queryString) {
		return `${baseUrl}/?${queryString}`;
	} else {
		return baseUrl;
	}
}

// ========================================GET NEWS LIST========================================
// This endpoint retrieves a list of items for given criteria for every other page after the first page
// This requires a cursor with the last item's id and published date
// ==================================================================================================

export function getNewsListNextPageEndpoint(
	cursor: { lastFeedItemId: string | undefined; lastPubdate: string | undefined },
	filter: NewsFilter,
	search: string
) {
	const query = new URLSearchParams();
	if (isValidFilter(filter)) {
		query.set('filter', filter);
	}
	if (isValidSearch(search)) {
		query.set('search', search);
	}
	if (
		cursor.lastFeedItemId &&
		cursor.lastPubdate &&
		isValidId(cursor.lastFeedItemId) &&
		isValidISODate(cursor.lastPubdate)
	) {
		query.set('lastFeedItemId', cursor.lastFeedItemId);
		query.set('lastPubdate', cursor.lastPubdate);
	}
	const queryString = query.toString();
	const baseUrl = `${API_BASE_URL}/api/v1/news/list/latest`;
	if (queryString) {
		return `${baseUrl}/?${queryString}`;
	} else {
		return baseUrl;
	}
}

// ========================================GET NEWS LIST + ITEM========================================
// This endpoint retrieves a list of items + the selected item specified by its id shown at index 0
// This is needed very much during server side rendering
// Lets say you scroll down 10 pages, click on the 201st item
// Now you copy its URL and then paste it in a new tab
// This endpoint gets triggered to handle such a request
// It will retrieve a list of items with the 201st item at index 0 without duplicates
// ==================================================================================================

export function getNewsListWithItemFirstPageEndpoint(
	filter: NewsFilter,
	id: string | undefined,
	search: string
) {
	const queryString = getFilterSearchQueryString(filter, search);
	const baseUrl = `${API_BASE_URL}/api/v1/news/list/item/${id}`;
	if (queryString) {
		return `${baseUrl}/?${queryString}`;
	} else {
		return baseUrl;
	}
}

// ========================================GET NEWS LIST + ITEM========================================
// Load subsequent pages of the above endpoint with a cursor basically
// ==================================================================================================

export function getNewsListWithItemNextPageEndpoint(
	cursor: { lastFeedItemId: string | undefined; lastPubdate: string | undefined },
	filter: NewsFilter,
	id: string | undefined,
	search: string
) {
	const query = new URLSearchParams();
	if (isValidFilter(filter)) {
		query.set('filter', filter);
	}
	if (isValidSearch(search)) {
		query.set('search', search);
	}
	if (
		cursor.lastFeedItemId &&
		cursor.lastPubdate &&
		isValidId(cursor.lastFeedItemId) &&
		isValidISODate(cursor.lastPubdate)
	) {
		query.set('lastFeedItemId', cursor.lastFeedItemId);
		query.set('lastPubdate', cursor.lastPubdate);
	}
	const queryString = query.toString();
	const baseUrl = `${API_BASE_URL}/api/v1/news/list/item/${id}`;
	if (queryString) {
		return `${baseUrl}/?${queryString}`;
	} else {
		return baseUrl;
	}
}
