import { DEFAULT_PAGINATION } from '$lib/models/Pagination';
import type { Video } from '$lib/models/Video';
import { getHomepageVideos } from '$lib/services/videos';
import { getOrderBy } from '$lib/stores/order_by/store';
import { getFromUrl as getSearchFromURL } from '$lib/stores/search/store';
import type { PageLoadEvent } from './$types';

export const prerender = false;

export type Data = { videos: Video[]; error: boolean };
export async function load({ fetch, url }: PageLoadEvent): Promise<Data> {
	const pagination = structuredClone(DEFAULT_PAGINATION);
	pagination.orderBy = getOrderBy(url);

	try {
		const videos = await getHomepageVideos(fetch, pagination, getSearchFromURL(url) ?? '');
		return { videos, error: false };
	} catch (e: unknown) {
		console.error(e);
		return { videos: [], error: true };
	}
}
