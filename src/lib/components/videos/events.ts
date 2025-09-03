import { DEFAULT_PAGINATION, type OrderBy, type Pagination } from '$lib/models/Pagination';
import type { Video } from '$lib/models/Video';
import { loading } from '$lib/stores/loading/store';
import { orderBy } from '$lib/stores/order_by/store';
import { handleApiError, openAdLink } from '$lib/utils/utils';
import { get } from 'svelte/store';

const VIDEOS_TO_LOAD_ON_BUTTON = 40;

export type GetVideosFunc = (pagination: Pagination) => Promise<Video[]>;

export const events = (loadedVideos: () => Video[], getVideosFunc: GetVideosFunc) => {
	let lastOrderByChangedDate: Date = new Date();

	const onClickLoadMore = async (
		onNewVideosLoaded: (result: { videos: Video[]; error: Error | null }) => void
	): Promise<void> => {
		if (get(loading).value) return;

		loading.set(true);
		try {
			const videos = await getVideosFunc({
				limit: VIDEOS_TO_LOAD_ON_BUTTON,
				offset: loadedVideos().length,
				orderBy: get(orderBy)
			});
			onNewVideosLoaded({ videos, error: null });
		} catch (e: unknown) {
			handleApiError(e);
			onNewVideosLoaded({ videos: [], error: e as Error });
		} finally {
			loading.set(false);
			openAdLink();
		}
	};

	const onOrderByChanged = async (newOrderBy: OrderBy, newVideos: (newVideos: Video[]) => void) => {
		if (new Date().getTime() - lastOrderByChangedDate.getTime() < 250) return;

		lastOrderByChangedDate = new Date();

		loading.set(true);
		try {
			const videos = await getVideosFunc({
				limit: DEFAULT_PAGINATION.limit,
				offset: DEFAULT_PAGINATION.offset,
				orderBy: newOrderBy
			});
			newVideos(videos);
		} catch (e: unknown) {
			handleApiError(e);
		} finally {
			loading.set(false);
		}
	};

	return {
		onClickLoadMore,
		onOrderByChanged
	};
};
