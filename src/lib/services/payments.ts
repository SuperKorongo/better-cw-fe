import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import type { Payment } from '$lib/models/Payment';
import { fetchWrapper } from '$lib/utils/fetch';
import { get } from 'svelte/store';
import { apiError } from '../../errors/apiError';
import type { PageLoadEvent } from '../../routes/$types';
import { getQueryParams } from './common';
import { cache } from '$lib/stores/cache/store';

export const getMyPayments = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination
): Promise<PaginatedResponse<Payment>> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/mine/?${getQueryParams(pagination, '', get(cache).myPurchases)}`
	);

	if (!response.ok) {
		throw apiError(response);
	}

	return await response.json();
};

export const getPaymentByUUID = async (
	fetch: PageLoadEvent['fetch'],
	uuid: string
): Promise<Payment> => {
	const cacheParam = get(cache).myPurchases;
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/mine/${uuid}${cacheParam ? `?cache=${cacheParam}` : ``}`
	);

	if (!response.ok) {
		throw apiError(response);
	}

	return await response.json();
};
