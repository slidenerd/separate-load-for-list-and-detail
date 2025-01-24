import { API_BASE_URL } from '$lib/config';
import { toUrlFriendly } from '$lib/functions';
import type { SymbolName } from '$lib/types/SymbolName';
import type { SymbolRank } from '$lib/types/SymbolRank';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// We need these only once so this is best loaded inside +layout.server.ts
type LayoutServerLoadReturnType = Promise<{
	mapNameNoSpecialCharsToSymbolName: Record<string, SymbolName>;
	mapSymbolNoSpecialCharsToSymbolName: Record<string, SymbolName>;
	symbolNames: { status_code: number; data: Array<SymbolName> };
	symbolRanks: { status_code: number; data: Array<SymbolRank> };
}>;

function buildMapNameNoSpecialCharsToSymbolName(symbolNames: SymbolName[]) {
	const map: Record<string, SymbolName> = {};
	for (let i = 0; i < symbolNames.length; i++) {
		const { id, name, symbol } = symbolNames[i];
		const nameNoSpecialChars = toUrlFriendly(name);
		if (nameNoSpecialChars && !map[nameNoSpecialChars]) {
			map[nameNoSpecialChars] = { id, name, symbol };
		}
	}
	return map;
}

function buildMapSymbolNoSpecialCharsToSymbolName(symbolNames: SymbolName[]) {
	const map: Record<string, SymbolName> = {};
	for (let i = 0; i < symbolNames.length; i++) {
		const { id, name, symbol } = symbolNames[i];
		const symbolNoSpecialChars = toUrlFriendly(symbol);
		if (symbolNoSpecialChars && !map[symbolNoSpecialChars]) {
			map[symbolNoSpecialChars] = { id, name, symbol };
		}
	}
	return map;
}

export const load: LayoutServerLoad = async ({ fetch }): LayoutServerLoadReturnType => {
	try {
		const [responseSymbolNames, responseSymbolRanks] = await Promise.all([
			fetch(`${API_BASE_URL}/api/v1/news/list/symbolNames`),
			fetch(`${API_BASE_URL}/api/v1/news/list/symbolRanks`)
		]);
		if (!responseSymbolNames.ok) {
			throw new Error(`Failed to fetch data: ${responseSymbolNames.statusText}`);
		}

		if (!responseSymbolRanks.ok) {
			throw new Error(`Failed to fetch data: ${responseSymbolRanks.statusText}`);
		}

		const [resultSymbolNames, resultSymbolRanks]: [
			{ status_code: number; data: Array<SymbolName> },
			{ status_code: number; data: Array<SymbolRank> }
		] = await Promise.all([responseSymbolNames.json(), responseSymbolRanks.json()]);

		const mapNameNoSpecialCharsToSymbolName = buildMapNameNoSpecialCharsToSymbolName(
			resultSymbolNames.data
		);
		const mapSymbolNoSpecialCharsToSymbolName = buildMapSymbolNoSpecialCharsToSymbolName(
			resultSymbolNames.data
		);

		return {
			mapNameNoSpecialCharsToSymbolName,
			mapSymbolNoSpecialCharsToSymbolName,
			symbolNames: resultSymbolNames,
			symbolRanks: resultSymbolRanks
		};
	} catch (e) {
		const message = e instanceof Error ? e.message : '';
		error(500, 'Something went wrong ' + message);
	}
};
