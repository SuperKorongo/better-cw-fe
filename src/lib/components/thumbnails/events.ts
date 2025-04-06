import { DEFAULT_PAGINATION, type OrderBy, type Pagination } from '$lib/models/Pagination';
import type { Video } from '$lib/models/Video';
import { loading } from '$lib/stores/loading/store';
import { search } from '$lib/stores/search/store';
import { getTranslation } from '$lib/translations';
import { isVideoDisplayRoute } from '$lib/utils/utils';
import { get } from 'svelte/store';
import * as toasts from '../toasts/toasts';

const VIDEOS_TO_LOAD_ON_SCROLL = 10;
const VIDEOS_TO_LOAD_ON_BUTTON = 25;

export const events = (
	orderBy: () => OrderBy,
	loadedVideos: () => Video[],
	getVideosFunc: (pagination: Pagination) => Promise<Video[]>
) => {
	const SCROLL_PERCENTAGE_THRESHOLD = 70 / 100;
	const MILLISECONDS_BETWEEN_LOADING_NEW_VIDEOS = 1500;

	let previousScroll: number = Number.MAX_SAFE_INTEGER;
	let lastLoadDate: Date = new Date();
	let lastOrderByChangedDate: Date = new Date();
	let lastSearchDate: Date = new Date();

	const onScroll = async (
		onNewVideosLoaded: (result: { videos: Video[]; error: Error | null }) => void,
		shouldLoadNewVideos: boolean
	): Promise<void> => {
		if (!isVideoDisplayRoute()) return;
		if (!shouldLoadNewVideos) return;

		const scrollingElement = document.scrollingElement!;
		const currentScroll = window.scrollY;

		if (currentScroll < previousScroll) {
			previousScroll = currentScroll;
			return;
		}

		const maxScroll = scrollingElement.scrollHeight - scrollingElement.clientHeight;

		if (canLoadNewVideos(currentScroll / maxScroll)) {
			if (get(loading).value) return;
			loading.set(true, false);

			try {
				lastLoadDate = new Date();
				const newVideos = await getVideosFunc({
					limit: VIDEOS_TO_LOAD_ON_SCROLL,
					offset: loadedVideos().length,
					orderBy: orderBy()
				});
				onNewVideosLoaded({ videos: newVideos, error: null });
			} catch (e: unknown) {
				onNewVideosLoaded({ videos: [], error: e as Error });
			} finally {
				loading.set(false);
			}
		}

		previousScroll = currentScroll;
	};

	const onClickLoadMore = async (
		onNewVideosLoaded: (result: { videos: Video[]; error: Error | null }) => void
	): Promise<void> => {
		if (get(loading).value) return;

		loading.set(true);
		try {
			const videos = await getVideosFunc({
				limit: VIDEOS_TO_LOAD_ON_BUTTON,
				offset: loadedVideos().length,
				orderBy: orderBy()
			});
			onNewVideosLoaded({ videos, error: null });
		} catch (e: unknown) {
			onNewVideosLoaded({ videos: [], error: e as Error });
		} finally {
			loading.set(false);
		}
	};

	const onOrderByChanged = async (newOrderBy: OrderBy, newVideos: (newVideos: Video[]) => void) => {
		if (
			new Date().getTime() - lastOrderByChangedDate.getTime() <
			MILLISECONDS_BETWEEN_LOADING_NEW_VIDEOS
		)
			return;

		lastOrderByChangedDate = new Date();

		loading.set(true);
		try {
			const videos = await getVideosFunc({
				limit: DEFAULT_PAGINATION.limit,
				offset: DEFAULT_PAGINATION.offset,
				orderBy: newOrderBy
			});
			newVideos(videos);
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
		} finally {
			loading.set(false);
		}
	};

	const onSearchChanged = async (text: string, newVideos: (newVideos: Video[]) => void) => {
		if (!get(search).forceLoad && !text) {
			const old = new Date();
			old.setDate(lastSearchDate.getDate() - 1);
			lastSearchDate = old;
			return;
		}

		if (new Date().getTime() - lastSearchDate.getTime() < MILLISECONDS_BETWEEN_LOADING_NEW_VIDEOS)
			return;

		lastSearchDate = new Date();

		loading.set(true);
		try {
			const videos = await getVideosFunc({
				limit: DEFAULT_PAGINATION.limit,
				offset: DEFAULT_PAGINATION.offset,
				orderBy: orderBy()
			});

			newVideos(videos);
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
		} finally {
			loading.set(false);
		}
	};

	function canLoadNewVideos(scrollPercentage: number): boolean {
		return (
			scrollPercentage >= SCROLL_PERCENTAGE_THRESHOLD &&
			new Date().getTime() - lastLoadDate.getTime() > MILLISECONDS_BETWEEN_LOADING_NEW_VIDEOS
		);
	}

	return {
		onScroll,
		onClickLoadMore,
		onOrderByChanged,
		onSearchChanged
	};
};
