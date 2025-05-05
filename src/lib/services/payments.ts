import { PUBLIC_DOMAIN, PUBLIC_STORE_API_URL } from '$env/static/public';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import { BLOCKCHAIN_CONFIRMED_STATUS, type Payment, type PaymentStatus } from '$lib/models/Payment';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import { fetchWrapper } from '$lib/utils/fetch';
import { get } from 'svelte/store';
import type { PageLoadEvent } from '../../routes/$types';
import { getQueryParams } from './common';

export const getMyPayments = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	status: number[] = []
): Promise<PaginatedResponse<Payment>> => {
	const statusQueryParam = status.reduce((acc, curr): string => {
		return acc + `&status[]=${curr}`;
	}, '');

	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/mine/?${getQueryParams(pagination, '', get(cacheInvalidation).myPurchases)}${statusQueryParam ? `${statusQueryParam}` : ``}`
	);

	return await response.json();
};

export const getPaymentByUUID = async (
	fetch: PageLoadEvent['fetch'],
	uuid: string
): Promise<Payment> => {
	const cacheParam = get(cacheInvalidation).myPurchases;
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/mine/${uuid}${cacheParam ? `?cache=${cacheParam}` : ``}`
	);

	return await response.json();
};

export const confirmVideo = async (
	fetch: PageLoadEvent['fetch'],
	paymentUUID: string,
	videoUUID: string
): Promise<void> => {
	await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/buyer-confirmation/${paymentUUID}/${videoUUID}`,
		{
			method: 'PATCH'
		}
	);
};

type NewPaymentResponse = {
	uuid: string;
	cryptoGatewayInvoiceUUID: string;
};
export const newPayment = async (
	fetch: PageLoadEvent['fetch'],
	videoUUIDs: string[]
): Promise<NewPaymentResponse> => {
	const response = await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/payments`, {
		method: 'POST',
		body: JSON.stringify({
			videos: videoUUIDs
		})
	});

	return (await response.json()) as NewPaymentResponse;
};

export const openCryptoWidgetPopup = (paymentUUID: string, cryptoGatewayUUID: string): void => {
	const widgetWindow = window.open(
		`${PUBLIC_DOMAIN}/crypto-widget?uuid=${cryptoGatewayUUID}`,
		'popupWindow',
		'width=750,height=800,scrollbars=no'
	) as WindowProxy;

	window.addEventListener(
		'message',
		({
			data
		}: MessageEvent<{
			invoice: {
				status: PaymentStatus;
			};
			type: 'status-update';
		}>) => {
			if (data.type !== 'status-update') {
				return;
			}

			if (data.invoice.status === BLOCKCHAIN_CONFIRMED_STATUS) {
				// todo: find a way to refresh the purchase[uuid] page
				// without relying on $effect on the cache invalidation
				cacheInvalidation.refreshMyPurchases();
				widgetWindow.close();
				document.location.href = `/admin/purchases/${paymentUUID}`;
				return;
			}

			// todo: find a way to refresh the purchase[uuid] page
			// without relying on $effect on the cache invalidation
			cacheInvalidation.refreshMyPurchases();
		}
	);

	// todo: show loading css and animation while the window is loading.
};
