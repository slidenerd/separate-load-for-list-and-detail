import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is 'news' => {
	return param === 'news';
}) satisfies ParamMatcher;
