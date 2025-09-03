import type { Pagination } from '$lib/models/Pagination';
import { filters as filtersStore } from '$lib/stores/video_filters/store';
import { get } from 'svelte/store';

export const getPaginationQueryParams = (
	pagination: Pagination,
	cacheBypass: number | null = null
): string => {
	return new URLSearchParams(getCommonQueryParams(pagination, cacheBypass)).toString();
};

export const getFetchVideosQueryParams = (
	pagination: Pagination,
	cacheBypass: number | null = null
): string => {
	const urlSearchParams = getCommonQueryParams(pagination, cacheBypass);

	const filters = get(filtersStore);
	if (filters.text) {
		urlSearchParams.set('text', filters.text);
	}
	// TODO: get videoFilters from QUERY PARAMS!!
	// on apply filter -> add filter to query param AND THEN FETCH VIDEOS.
	/*if (filters !== null) {
		if (filters.text) {
			urlSearchParams['text'] = filters.text;
		}
		// todo: apply filters
		// todo2: search is a filter so put it inside the filters object
	}
*/
	return new URLSearchParams(urlSearchParams).toString();
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
