import type { Filters } from '$lib/models/Filters';
import { writable } from 'svelte/store';

export const TEXT_FILTER_QUERY_PARAM = 'search';

export const filters = (() => {
	const { subscribe, update } = writable<Filters>({});

	return {
		subscribe,

		set: (newValue: Filters) => update(() => newValue),

		setEmpty: () =>
			update(() => {
				return {};
			}),

		setText: (text: Filters['text']) =>
			update((filters: Filters | null) => {
				return { ...filters, text };
			}),

		init: (queryParams: URLSearchParams) =>
			update(() => {
				return {
					text: queryParams.get(TEXT_FILTER_QUERY_PARAM) ?? undefined
				};
			})
	};
})();
