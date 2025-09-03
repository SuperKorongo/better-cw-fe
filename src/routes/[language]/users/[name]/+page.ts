import { DEFAULT_PAGINATION } from '$lib/models/Pagination';
import type { Video } from '$lib/models/Video';
import { getVideosBy, USERS_ENDPOINT } from '$lib/services/videos';
import { getOrderBy } from '$lib/stores/order_by/store';
import type { PageLoadEvent } from './$types';

export const prerender = false;

export type Data = { videos: Video[]; error: boolean };
export async function load({ params, url, fetch }: PageLoadEvent): Promise<Data> {
	const typedParams = params as { name: string };
	const pagination = structuredClone(DEFAULT_PAGINATION);
	pagination.orderBy = getOrderBy(url);

	try {
		const videos = await getVideosBy(fetch, USERS_ENDPOINT, typedParams.name, pagination);

		return { videos, error: false };
	} catch (e: unknown) {
		console.error(e);
		return { videos: [], error: true };
	}
}
