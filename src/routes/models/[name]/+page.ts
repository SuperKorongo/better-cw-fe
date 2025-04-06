import * as toasts from '$lib/components/toasts/toasts';
import { DEFAULT_PAGINATION } from '$lib/models/Pagination';
import type { Video } from '$lib/models/Video';
import { getVideosBy, MODELS_ENDPOINT } from '$lib/services/videos';
import type { PageLoadEvent } from '../../$types';
import { getOrderBy } from '../../../stores/order_by/store';
import { getFromUrl as getSearchFromURL } from '../../../stores/search/store';
import { getTranslation } from '../../../translations';

export const prerender = false;

export type Data = { videos: Video[]; error: boolean };
export async function load({ params, url, fetch }: PageLoadEvent): Promise<Data> {
	const typedParams = params as { name: string };
	const pagination = structuredClone(DEFAULT_PAGINATION);
	pagination.orderBy = getOrderBy(url);

	try {
		const videos = await getVideosBy(
			fetch,
			MODELS_ENDPOINT,
			typedParams.name,
			pagination,
			getSearchFromURL(url) ?? ''
		);

		return { videos, error: false };
	} catch {
		toasts.error(getTranslation('common.errors.generic'));
		return { videos: [], error: true };
	}
}
