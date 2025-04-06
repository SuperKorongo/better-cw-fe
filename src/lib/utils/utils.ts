import { goto, pushState } from '$app/navigation';
import { page } from '$app/state';
import { PUBLIC_THUMBNAIL_IMAGES_URL } from '$env/static/public';
import type { Video } from '$lib/models/Video';
import { loading } from '$lib/stores/loading/store';
import { ORDER_BY_QUERY_PARAM, orderBy } from '$lib/stores/order_by/store';
import { search, SEARCH_QUERY_PARAM } from '$lib/stores/search/store';
import { get } from 'svelte/store';

export const MOBILE_BREAKPOINT_PX = 900;

export const EMPTY_IMAGE_SRC =
	'data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7';

export const getDurationString = (durationInSeconds: number): string => {
	const hours = durationInSeconds / 60 / 60;
	const minutes = (hours % 1) * 60;
	const seconds = (minutes % 1) * 60;

	const hoursAsString = getFormattedDuration(hours);
	if (parseInt(hoursAsString) === 0) {
		return `${getFormattedDuration(minutes)}:${getFormattedDuration(seconds)}`;
	}

	return `${hoursAsString}:${getFormattedDuration(minutes)}:${getFormattedDuration(seconds)}`;
};

export function getFormattedDuration(duration: number): string {
	let stringDuration = Math.trunc(duration).toString();
	if (stringDuration.length === 1) {
		stringDuration = '0' + stringDuration;
	}

	return stringDuration;
}

export function getFormattedPrice(price: Video['price']): string {
	if (!price) return '';
	return `${price.currency.symbol}${price.value}`;
}

export function onClickInternalLink(e: MouseEvent): void {
	e.preventDefault();

	const { href, pathname } = e.currentTarget as HTMLAnchorElement;

	if (page.url.href === href && !get(search).value) {
		return;
	}

	if (get(search).value) {
		search.set({ value: null, forceLoad: true });
	}

	if (page.state.selectedVideo) {
		pushState('', { selectedVideo: undefined });
	}

	document.body.style.overflowY = 'scroll';

	if (page.url.pathname !== pathname) loading.set(true);

	goto(href);
}

export function getSearchAndOrderQueryParams() {
	const $orderBy = get(orderBy);
	const $search = get(search);

	const queryParams = new URLSearchParams();

	if ($orderBy) {
		queryParams.set(ORDER_BY_QUERY_PARAM, `${$orderBy.column}|${$orderBy.direction}`);
	}

	if ($search.value) {
		queryParams.set(SEARCH_QUERY_PARAM, $search.value);
	}

	return `?${queryParams.toString()}`;
}

export const sleep = (milliseconds: number) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const getImageSrc = (path: string, small: boolean = false): string => {
	return PUBLIC_THUMBNAIL_IMAGES_URL + path + (small ? '-small' : '') + '.png';
};

export const getPlaceholderImageSrc = (): string => {
	return PUBLIC_THUMBNAIL_IMAGES_URL + 'placeholder.png';
};

export const enterKeyCheck = (key: string, action: () => void): void => {
	if (key === 'Enter') action();
};

export const isMobileScreen = (): boolean => {
	return window.innerWidth <= MOBILE_BREAKPOINT_PX;
};

export const isVideoDisplayRoute = (): boolean => {
	return ['/', '/users/[name]', '/models/[name]', '/tags/[name]'].includes(page.route.id!);
};

export const getFormattedDate = (timestampInSeconds: number): string => {
	const date = new Date(timestampInSeconds * 1000);

	return date.toLocaleDateString();
};
