import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { Friend, FriendRequest } from '$lib/models/FriendRequest';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import { fetchWrapper } from '$lib/utils/fetch';
import { get } from 'svelte/store';
import type { PageLoadEvent } from '../../routes/[language]/$types';
import { getPaginationQueryParams } from './common';

export const getFriendRequest = async (
	fetch: PageLoadEvent['fetch'],
	userUUID: string
): Promise<FriendRequest> => {
	const cacheParam = get(cacheInvalidation).myFriends ?? '-';

	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/friends/${userUUID}?cache=${cacheParam}`,
		{
			method: 'GET'
		}
	);

	return await response.json();
};

export const sendFriendRequest = async (
	fetch: PageLoadEvent['fetch'],
	userUUID: string
): Promise<FriendRequest> => {
	const response = await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/friends/${userUUID}`, {
		method: 'POST'
	});

	return await response.json();
};

export const deleteFriendRequest = async (
	fetch: PageLoadEvent['fetch'],
	requestUUID: string
): Promise<void> => {
	await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/friends/${requestUUID}`, {
		method: 'DELETE'
	});
};

export const acceptFriendRequest = async (
	fetch: PageLoadEvent['fetch'],
	requestUUID: string
): Promise<void> => {
	await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/friends/${requestUUID}`, {
		method: 'PATCH'
	});
};

export const getMyFriends = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	search: string = ''
): Promise<PaginatedResponse<Friend>> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/friends/?${getPaginationQueryParams(pagination, get(cacheInvalidation).myFriends)}&text=${search}`,
		{
			method: 'GET'
		}
	);

	return await response.json();
};

export const getPendingFriendRequestsSent = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	search: string = ''
): Promise<PaginatedResponse<Friend>> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/friends/pending/sent/?${getPaginationQueryParams(pagination, get(cacheInvalidation).myFriends)}&text=${search}`,
		{
			method: 'GET'
		}
	);

	return await response.json();
};

export const getPendingFriendRequestsReceived = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	search: string = ''
): Promise<PaginatedResponse<Friend>> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/friends/pending/received/?${getPaginationQueryParams(pagination, get(cacheInvalidation).myFriends)}&text=${search}`,
		{
			method: 'GET'
		}
	);

	return await response.json();
};
