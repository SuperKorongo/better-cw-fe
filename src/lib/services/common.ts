import type { Pagination } from '$lib/models/Pagination';
import { filters as filtersStore, toAPIQueryParams } from '$lib/stores/video_filters/store';
import { get } from 'svelte/store';

export const getPaginationQueryParams = (
	pagination: Pagination,
	cacheBypass: number | null = null
): string => {
	return getCommonQueryParams(pagination, cacheBypass).toString();
};

export const getFetchVideosQueryParams = (
	pagination: Pagination,
	cacheBypass: number | null = null
): string => {
	const commonQueryParams = getCommonQueryParams(pagination, cacheBypass);
	const filterParams = toAPIQueryParams(get(filtersStore));

	return new URLSearchParams([...commonQueryParams, ...filterParams]).toString();
};

function getCommonQueryParams(
	{ limit, offset, orderBy }: Pagination,
	cacheBypass: number | null = null
): URLSearchParams {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set('limit', limit.toString());
	urlSearchParams.set('offset', offset.toString());

	if (orderBy) {
		urlSearchParams.set('order_by', `${orderBy.column}|${orderBy.direction}`);
	}

	if (cacheBypass !== null) {
		urlSearchParams.set('cache', cacheBypass.toString());
	}

	return urlSearchParams;
}
