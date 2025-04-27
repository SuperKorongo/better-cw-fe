import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { Dispute } from '$lib/models/Dispute';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import { fetchWrapper } from '$lib/utils/fetch';
import { get } from 'svelte/store';
import type { PageLoadEvent } from '../../../routes/$types';
import { getQueryParams } from '../common';

export const openDispute = async (
	fetch: PageLoadEvent['fetch'],
	invoiceUUID: string,
	videoUUID: string,
	claim: string
): Promise<Dispute> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/disputes/new/${invoiceUUID}/${videoUUID}`,
		{
			method: 'POST',
			body: JSON.stringify({ claim })
		}
	);

	return await response.json();
};

export const addClaimToDispute = async (
	fetch: PageLoadEvent['fetch'],
	disputeUUID: string,
	claim: string
): Promise<void> => {
	await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/disputes/${disputeUUID}/claims`, {
		method: 'PUT',
		body: JSON.stringify({ claim })
	});
};

export const getDisputeByUUID = async (
	fetch: PageLoadEvent['fetch'],
	disputeUUID: string
): Promise<Dispute> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/disputes/mine/${disputeUUID}`
	);

	return await response.json();
};

export const closeDispute = async (
	fetch: PageLoadEvent['fetch'],
	disputeUUID: string,
	resolution: number = 1
): Promise<void> => {
	await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/disputes/${disputeUUID}/close`, {
		method: 'PATCH',
		body: JSON.stringify({ resolution })
	});
};

export const getDisputes = async (
	fetch: PageLoadEvent['fetch'],
	asWho: 'buyer' | 'seller',
	pagination: Pagination,
	status: number[] = []
): Promise<PaginatedResponse<Dispute>> => {
	const statusQueryParam = status.reduce((acc, curr): string => {
		return acc + `&status[]=${curr}`;
	}, '');

	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/disputes/mine/${asWho}?${getQueryParams(pagination, '', get(cacheInvalidation).myPurchases)}${statusQueryParam ? `${statusQueryParam}` : ``}`
	);

	return await response.json();
};
