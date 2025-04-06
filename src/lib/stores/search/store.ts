import { page } from '$app/state';
import { writable } from 'svelte/store';

export const SEARCH_QUERY_PARAM = 'search';

type Data = {
	value: string | null;
	forceLoad: boolean;
};

export const search = (() => {
	const { subscribe, update } = writable<Data>({ value: null, forceLoad: false });

	return {
		subscribe,

		set: (search: Data) => update(() => search),

		init: () =>
			update(() => {
				return {
					value: getFromUrl(page.url) ?? null,
					forceLoad: false
				};
			})
	};
})();

export function getFromUrl(url: URL): string | null {
	const queryParamValue = new URLSearchParams(url.search).get(SEARCH_QUERY_PARAM);
	if (!queryParamValue) return null;

	return queryParamValue;
}
