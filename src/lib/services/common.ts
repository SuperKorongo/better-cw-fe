import type { GetVideosFuncParams } from '$lib/components/videos/events';
import type { Pagination } from '$lib/models/Pagination';

export const getQueryParams = (
	{ limit, offset, orderBy }: Pagination,
	search: string = '',
	filters: GetVideosFuncParams['filters'] | null = null,
	cacheBypass: number | null = null
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
	if (filters !== null) {
		urlSearchParams['free'] = filters.freeVideosOnly ? '1' : '0';
	}
	if (cacheBypass !== null) {
		urlSearchParams['cache'] = cacheBypass.toString();
	}

	return new URLSearchParams(urlSearchParams).toString();
};
