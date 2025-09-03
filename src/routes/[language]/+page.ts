import { DEFAULT_PAGINATION } from '$lib/models/Pagination';
import type { Video } from '$lib/models/Video';
import { getHomepageVideos } from '$lib/services/videos';
import { getOrderBy } from '$lib/stores/order_by/store';
import { filters } from '$lib/stores/video_filters/store';
import type { Language } from '$lib/translations';
import { setLanguage } from '$lib/translations';
import availableLanguages from '$lib/translations/available_languages.json' with { type: 'json' };
import { redirect } from '@sveltejs/kit';
import type { PageLoadEvent } from './$types';

export const prerender = false;

export type Data = { videos: Video[]; error: boolean };
export async function load(e: PageLoadEvent): Promise<Data> {
	const params = e.params as { language: Language };

	if (!availableLanguages.includes(params.language)) {
		throw redirect(301, `/en`);
	}

	setLanguage(params.language);

	const pagination = structuredClone(DEFAULT_PAGINATION);
	pagination.orderBy = getOrderBy(e.url);

	try {
		filters.init(e.url.searchParams);
		const videos = await getHomepageVideos(e.fetch, pagination);
		return { videos, error: false };
	} catch (e: unknown) {
		console.error(e);
		return { videos: [], error: true };
	}
}
