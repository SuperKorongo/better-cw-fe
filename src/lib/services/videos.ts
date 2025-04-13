import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import type { Data as VideoData } from '$lib/stores/video-form/store';
import { fetchWrapper } from '$lib/utils/fetch';
import { apiError } from '../../errors/apiError';
import type { PageLoadEvent } from '../../routes/$types';
import type { Video } from '../models/Video';
import { getQueryParams } from './common';

export const MEGA_PREFIX = 'https://mega.nz/file/';

export const getHomepageVideos = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	search: string
): Promise<Video[]> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/?${getQueryParams(pagination, search)}`
	);

	if (!response.ok) {
		throw apiError(response);
	}

	const paginatedResponse = (await response.json()) as PaginatedResponse<Video>;
	return paginatedResponse.data;
};

export const getVideoByUUID = async (
	fetch: PageLoadEvent['fetch'],
	uuid: string,
	bypassCache: boolean = false
): Promise<Video> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/${uuid}${bypassCache ? `?${new Date().getTime()}` : ``}`
	);

	if (!response.ok) {
		throw apiError(response);
	}

	return await response.json();
};

type VideosEndpoint = 'user' | 'model' | 'tag';
export const USERS_ENDPOINT: VideosEndpoint = 'user';
export const MODELS_ENDPOINT: VideosEndpoint = 'model';
export const TAGS_ENDPOINT: VideosEndpoint = 'tag';
export const getVideosBy = async (
	fetch: PageLoadEvent['fetch'],
	endpoint: VideosEndpoint,
	name: string,
	pagination: Pagination,
	search: string
): Promise<Video[]> => {
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/videos/${endpoint}/${name}/?${getQueryParams(pagination, search)}`
	);

	if (!response.ok) {
		throw apiError(response);
	}

	const paginatedResponse = (await response.json()) as PaginatedResponse<Video>;
	return paginatedResponse.data;
};

export type UploadVideoRequest = {
	title: string;
	priceInCentsOfDollar: number;
	durationInSeconds: number;
	tags: string[];
	downloadLink: string;
	description?: string;
	model?: string;
	downloadLinkInstructions?: string;
};
export const upload = async (data: VideoData): Promise<string> => {
	const uploadVideoRequest: Partial<UploadVideoRequest> & { [key: string]: unknown } = {};

	for (const [key, value] of Object.entries(data)) {
		uploadVideoRequest[key] = value;
	}
	delete uploadVideoRequest['blobs'];

	const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/videos/`, {
		method: 'PUT',
		body: JSON.stringify({ videos: [uploadVideoRequest] })
	});

	if (!response.ok) {
		throw apiError(response);
	}

	const { uuids } = (await response.json()) as {
		uuids: string[];
	};
	const uuid = uuids[0];

	try {
		for (const thumbnail of data.thumbnails) {
			if (thumbnail === null) {
				continue;
			}
			uploadThumbnail(uuid, thumbnail.blob);
		}
	} catch {
		// nothing, we don't care
	}

	return uuid;
};

export const uploadThumbnail = async (videoUUID: string, blob: Blob | null): Promise<void> => {
	if (blob === null) {
		return;
	}

	const formData = new FormData();
	formData.append('thumbnail', blob);

	await fetchWrapper(window.fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/thumbnails/${videoUUID}/thumbnail`,
		{
			method: 'PUT',
			body: formData
		}
	);
};
