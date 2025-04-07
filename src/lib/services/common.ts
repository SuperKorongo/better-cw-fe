import type { Pagination } from '$lib/models/Pagination';

export const getQueryParams = (
	{ limit, offset, orderBy }: Pagination,
	search: string = ''
): string => {
	const urlSearchParams: Record<string, string> = {
		limit: limit.toString(),
		offset: offset.toString()
	};
	if (orderBy) {
		urlSearchParams['order_by'] = `${orderBy.column}|${orderBy.direction}`;
	}
	if (search) {
		urlSearchParams['text'] = search;
	}

	return new URLSearchParams(urlSearchParams).toString();
};
