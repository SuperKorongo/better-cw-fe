import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { Friend, FriendRequest } from '$lib/models/FriendRequest';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import { fetchWrapper } from '$lib/utils/fetch';
import type { PageLoadEvent } from '../../routes/[language]/$types';
import { getQueryParams } from './common';

export const getFriendRequest = async (
	fetch: PageLoadEvent['fetch'],
	userUUID: string
): Promise<FriendRequest> => {
	const response = await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/friends/${userUUID}`, {
		method: 'GET'
	});

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
	pagination: Pagination
): Promise<Friend[]> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/friends/${getQueryParams(pagination)}`,
		{
			method: 'GET'
		}
	);

	const paginatedResponse = (await response.json()) as PaginatedResponse<Friend>;
	return paginatedResponse.data;
};
