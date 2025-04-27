import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import type { Data as VideoData } from '$lib/stores/video-form/store';
import { fetchWrapper } from '$lib/utils/fetch';
import { get } from 'svelte/store';
import type { PageLoadEvent } from '../../../routes/$types';
import type { AdminListVideo, Video } from '../../models/Video';
import { getQueryParams } from '../common';
import type { UploadVideoRequest } from '../videos';

export const getUserVideos = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	search: string
): Promise<PaginatedResponse<AdminListVideo>> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/mine/?${getQueryParams(pagination, search, get(cacheInvalidation).myVideos)}`
	);

	return await response.json();
};

export type AdminVideo = Video & {
	downloadLink: string;
	downloadLinkInstructions: string | null;
};

export const getUserVideoByUUID = async (
	fetch: PageLoadEvent['fetch'],
	uuid: string
): Promise<AdminVideo> => {
	const cacheParam = get(cacheInvalidation).myVideos;
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/mine/${uuid}${cacheParam ? `?cache=${cacheParam}` : ``}`
	);

	return await response.json();
};

export const patch = async (
	uuid: string,
	data: Partial<VideoData> & { active?: boolean }
): Promise<void> => {
	const patchVideoRequest: Partial<UploadVideoRequest> & {
		[key: string]: unknown;
		active?: boolean;
	} = {};
	for (const [key, value] of Object.entries(data)) {
		patchVideoRequest[key] = value;
	}
	delete patchVideoRequest['blobs'];

	await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/videos/${uuid}`, {
		method: 'PATCH',
		body: JSON.stringify(patchVideoRequest)
	});
};

export const replaceThumbnail = async (
	videoUUID: string,
	thumbnailPosition: number,
	blob: Blob
): Promise<void> => {
	const formData = new FormData();
	formData.append('thumbnail', blob);

	await fetchWrapper(window.fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/thumbnails/${videoUUID}/thumbnail/${thumbnailPosition}`,
		{
			method: 'PATCH',
			body: formData
		}
	);
};

export const deleteThumbnail = async (
	videoUUID: string,
	thumbnailPosition: number
): Promise<void> => {
	await fetchWrapper(window.fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/thumbnails/${videoUUID}/thumbnail/${thumbnailPosition}`,
		{
			method: 'DELETE'
		}
	);
};

export const rateVideo = async (
	invoiceUUID: string,
	videoUUID: string,
	rating: number
): Promise<void> => {
	await fetchWrapper(window.fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/rate/${invoiceUUID}/${videoUUID}/${rating}`,
		{
			method: 'POST'
		}
	);
};
