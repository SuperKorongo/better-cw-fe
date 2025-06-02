import { page } from '$app/state';
import { DEFAULT_PAGINATION, type OrderBy } from '$lib/models/Pagination';
import { writable } from 'svelte/store';

export const ORDER_BY_QUERY_PARAM = 'order_by';

export const orderBy = (() => {
	const { subscribe, update } = writable<OrderBy>(DEFAULT_PAGINATION.orderBy!);

	return {
		subscribe,

		set: (orderBy: OrderBy) =>
			update(() => {
				return orderBy;
			}),

		init: () =>
			update(() => {
				const orderBy = getOrderBy(page.url) ?? DEFAULT_PAGINATION.orderBy!;
				return orderBy;
			})
	};
})();

export function getOrderBy(url: URL): OrderBy | null {
	return getFromUrl(url) ?? null;
}

export function getFromUrl(url: URL): OrderBy | null {
	const queryParamValue = new URLSearchParams(url.search).get(ORDER_BY_QUERY_PARAM);
	if (!queryParamValue) return null;

	const [column, direction] = queryParamValue.split('|');
	return { column, direction } as OrderBy;
}
