import type { Duration, Filters, Visibility } from '$lib/models/Filters';
import { writable } from 'svelte/store';

export const TEXT_FILTER_QUERY_PARAM = 'search';
export const MIN_PRICE_QUERY_PARAM = 'min_price';
export const MAX_PRICE_QUERY_PARAM = 'max_price';
export const VISIBILITY_QUERY_PARAM = 'visibility';
export const DURATION_QUERY_PARAM = 'duration';

export const MAX_MAX_PRICE = 100;

export const filters = (() => {
	const { subscribe, update } = writable<Filters>(getEmptyFilters());

	return {
		subscribe,

		set: (newValue: Filters) => update(() => newValue),

		setEmpty: () => update(getEmptyFilters),

		setText: (text: Filters['text']) =>
			update((filters: Filters | null) => {
				return { ...filters, text };
			}),

		init: (queryParams: URLSearchParams) =>
			update(() => {
				return {
					text: queryParams.get(TEXT_FILTER_QUERY_PARAM) ?? '',
					minPrice: parseFloat(queryParams.get(MIN_PRICE_QUERY_PARAM) ?? '0'),
					maxPrice: parseFloat(queryParams.get(MAX_PRICE_QUERY_PARAM) ?? MAX_MAX_PRICE.toString()),
					visibility: (queryParams.get(VISIBILITY_QUERY_PARAM) as Visibility) ?? 'any',
					duration: (queryParams.get(DURATION_QUERY_PARAM) as Duration) ?? 'any'
				};
			})
	};
})();

export function toFrontendQueryParams(filters: Filters): URLSearchParams {
	const queryParams = new URLSearchParams();

	if (filters.text) {
		queryParams.set(TEXT_FILTER_QUERY_PARAM, filters.text);
	}
	queryParams.set(MIN_PRICE_QUERY_PARAM, filters.minPrice ? filters.minPrice.toString() : '0');
	queryParams.set(MAX_PRICE_QUERY_PARAM, filters.maxPrice ? filters.maxPrice.toString() : '0');
	if (filters.visibility) {
		queryParams.set(VISIBILITY_QUERY_PARAM, filters.visibility);
	}
	if (filters.duration) {
		queryParams.set(DURATION_QUERY_PARAM, filters.duration);
	}

	return queryParams;
}

export function toAPIQueryParams(filters: Filters): URLSearchParams {
	const queryParams = new URLSearchParams();

	if (filters.text) {
		queryParams.set('text', filters.text);
	}
	queryParams.set('min_price', filters.minPrice ? filters.minPrice.toString() + '00' : '0');

	if (filters.maxPrice && filters.maxPrice < MAX_MAX_PRICE) {
		queryParams.set('max_price', filters.maxPrice.toString() + '00');
	}

	if (!filters.maxPrice) {
		queryParams.set('max_price', '0');
	}

	if (filters.visibility && filters.visibility !== 'any') {
		queryParams.set('visibility', filters.visibility);
	}
	if (filters.duration && filters.duration !== 'any') {
		switch (filters.duration) {
			case 'short':
				queryParams.set('duration', '1s-2m');
				break;
			case 'medium':
				queryParams.set('duration', '2m-20m');
				break;
			case 'long':
				queryParams.set('duration', '>20m');
				break;
			default:
				queryParams.set('duration', 'any');
				break;
		}
	}

	return queryParams;
}

function getEmptyFilters(): Filters {
	return {
		text: '',
		minPrice: 0,
		maxPrice: MAX_MAX_PRICE,
		visibility: 'any',
		duration: 'any'
	};
}
