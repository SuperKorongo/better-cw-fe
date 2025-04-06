import { page } from '$app/state';
import { DEFAULT_PAGINATION, type OrderBy } from '$lib/models/Pagination';
import { writable } from 'svelte/store';

const ORDER_BY_COOKIE_NAME = 'order_by';
export const ORDER_BY_QUERY_PARAM = 'order_by';

export const orderBy = (() => {
	const { subscribe, update } = writable<OrderBy>(DEFAULT_PAGINATION.orderBy!);

	return {
		subscribe,

		set: (orderBy: OrderBy) =>
			update(() => {
				setCookie(orderBy);
				return orderBy;
			}),

		init: () =>
			update(() => {
				const orderBy = getOrderBy(page.url) ?? DEFAULT_PAGINATION.orderBy!;
				setCookie(orderBy);
				return orderBy;
			})
	};
})();

function setCookie(orderBy: OrderBy) {
	const cookieExpirationDays = 30;
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + cookieExpirationDays);

	const value = `${ORDER_BY_COOKIE_NAME}=${orderBy.column}|${orderBy.direction}`;
	const expiration = `expires=${expirationDate.toUTCString()}`;

	document.cookie = `${value}; ${expiration}; Path=/; SameSite=Lax`;
}

export function getOrderBy(url: URL): OrderBy | null {
	return getFromUrl(url) ?? getFromCookie() ?? null;
}

export function getFromUrl(url: URL): OrderBy | null {
	const queryParamValue = new URLSearchParams(url.search).get(ORDER_BY_QUERY_PARAM);
	if (!queryParamValue) return null;

	const [column, direction] = queryParamValue.split('|');
	return { column, direction } as OrderBy;
}

export function getFromCookie(): OrderBy | null {
	if (typeof document === 'undefined') return null;

	const orderByCookie = document.cookie.split('; ').find((cookie) => {
		return cookie.split('=')[0] === ORDER_BY_COOKIE_NAME;
	});
	if (!orderByCookie) return null;

	const [column, direction] = orderByCookie.split('=')[1].split('|');
	return { column, direction } as OrderBy;
}
