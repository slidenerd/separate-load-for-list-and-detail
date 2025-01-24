import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): boolean => {
	return /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-f]{12}/i.test(param);
}) satisfies ParamMatcher;
