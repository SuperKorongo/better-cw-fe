import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import type { Payment } from '$lib/models/Payment';
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
