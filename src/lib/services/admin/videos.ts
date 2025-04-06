import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import { fetchWrapper } from '$lib/utils/fetch';
import { apiError } from '../../../errors/apiError';
import type { PageLoadEvent } from '../../../routes/$types';
import type { Data as VideoData } from '../../../stores/video-form/store';
import type { AdminListVideo, Video } from '../../models/Video';
import { getQueryParams } from '../common';
import type { UploadVideoRequest } from '../videos';

export const getUserVideos = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	search: string
): Promise<PaginatedResponse<AdminListVideo>> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/mine/?${getQueryParams(pagination, search)}`
	);

	if (!response.ok) {
		throw apiError(response);
	}

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
	const response = await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/videos/mine/${uuid}`);

	if (!response.ok) {
		throw apiError(response);
	}

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

	const response = await fetchWrapper(window.fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/${uuid}`,
		{
			method: 'PATCH',
			body: JSON.stringify(patchVideoRequest)
		}
	);

	if (!response.ok) {
		throw apiError(response);
	}
};

export const replaceThumbnail = async (
	videoUUID: string,
	thumbnailPosition: number,
	blob: Blob
): Promise<void> => {
	const formData = new FormData();
	formData.append('thumbnail', blob);

	await fetchWrapper(window.fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/${videoUUID}/thumbnail/${thumbnailPosition}`,
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
		`${PUBLIC_STORE_API_URL}/api/v1/videos/${videoUUID}/thumbnail/${thumbnailPosition}`,
		{
			method: 'DELETE'
		}
	);
};
