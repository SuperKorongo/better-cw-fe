import { goto, pushState } from '$app/navigation';
import { page } from '$app/state';
import { PUBLIC_THUMBNAIL_IMAGES_URL } from '$env/static/public';
import * as toasts from '$lib/components/toasts/toasts';
import type { Video } from '$lib/models/Video';
import { language } from '$lib/stores/language/store';
import { loading } from '$lib/stores/loading/store';
import { menu } from '$lib/stores/menu/store';
import { ORDER_BY_QUERY_PARAM, orderBy } from '$lib/stores/order_by/store';
import { search, SEARCH_QUERY_PARAM } from '$lib/stores/search/store';
import { getTranslation } from '$lib/translations';
import { get } from 'svelte/store';
import type { ApiError } from '../../errors/apiError';

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
	return price.value ? `${price.currency.symbol}${price.value}` : getTranslation('video.free');
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

	if (get(menu).overlay) {
		get(menu).overlay!.style.display = 'none';
	}
	goto(pathname);
}

export function goToInternalLink(e: MouseEvent, href: string): void {
	loading.set(true);

	const anchor = document.createElement('a');
	anchor.setAttribute('href', getHrefWithLanguage(href));

	onClickInternalLink({
		...e,
		preventDefault() {},
		currentTarget: anchor
	});
}

export function getHrefWithLanguage(href: string): string {
	return `/${get(language)}${href}`;
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
	return [
		'/[language]',
		'/[language]/users/[name]',
		'/[language]/models/[name]',
		'/[language]/tags/[name]'
	].includes(page.route.id!);
};

export const getFormattedDate = (timestampInSeconds: number): string => {
	const date = new Date(timestampInSeconds * 1000);
	return date.toLocaleDateString();
};

export const getFormattedDateWithTime = (timestampInSeconds: number): string => {
	const date = new Date(timestampInSeconds * 1000);
	return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const ifNotLoading = (action: () => void) => {
	if (get(loading).value) return;
	action();
};

export const showVideoSidePanel = (
	e: MouseEvent,
	linkElement: HTMLAnchorElement,
	video: Video
): void => {
	if (e.shiftKey || e.metaKey || e.ctrlKey || e.button === 1) return;

	e.preventDefault();

	pushState(linkElement.href, { selectedVideo: video });
};

export const handleApiError = (
	e: unknown,
	errorMessageKey: string = 'common.errors.generic',
	httpCodeFunctionMap: Map<number, () => void> | null = null
): void => {
	const apiError = e as ApiError;
	if (!e || !(e as ApiError).getCode) {
		toasts.error(getTranslation(errorMessageKey));
		return;
	}
	if (apiError.getCode() === 429 || apiError.getCode() === 401) {
		return; // Already handled in fetchWrapper
	}

	if (httpCodeFunctionMap === null) {
		toasts.error(getTranslation(errorMessageKey));
		return;
	}

	const func = httpCodeFunctionMap.get(apiError.getCode());
	if (func) {
		func();
		return;
	}

	toasts.error(getTranslation(errorMessageKey));
};
