import { getNewsListFirstPageEndpoint } from '$lib/endpoints/backend';
import type { NewsFilter } from '$lib/types/NewsFilter';
import type { NewsItem } from '$lib/types/NewsItem';
import type { SymbolName } from '$lib/types/SymbolName';
import type { SymbolRank } from '$lib/types/SymbolRank';
import type { LayoutLoad } from './$types';

type LayoutLoadReturnType = {
	filter: NewsFilter;
	id: string | undefined;
	latestNewsPromise: Promise<{
		status_code: number;
		data: Array<NewsItem>;
	}>;
	mapNameNoSpecialCharsToSymbolName: Record<string, SymbolName>;
	mapSymbolNoSpecialCharsToSymbolName: Record<string, SymbolName>;
	search: string;
	symbolNames: { status_code: number; data: Array<SymbolName> };
	symbolRanks: { status_code: number; data: Array<SymbolRank> };
	title: string | undefined;
};

export const load: LayoutLoad = ({ data, fetch, params, url }): LayoutLoadReturnType => {
	const filter = (url.searchParams.get('filter') as NewsFilter) || 'latest';
	const id = params.id;
	const search = url.searchParams.get('search') || '';
	const title = params.title;

	const {
		mapNameNoSpecialCharsToSymbolName,
		mapSymbolNoSpecialCharsToSymbolName,
		symbolNames,
		symbolRanks
	} = data;

	const endpoint = getNewsListFirstPageEndpoint(filter, search);

	return {
		filter,
		id,
		latestNewsPromise: fetch(endpoint).then((r) => r.json()),
		mapNameNoSpecialCharsToSymbolName,
		mapSymbolNoSpecialCharsToSymbolName,
		search,
		symbolNames,
		symbolRanks,
		title
	};
};
