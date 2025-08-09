import { PUBLIC_STORE_API_URL } from '$env/static/public';
import { fetchWrapper } from '$lib/utils/fetch';
import type { PageLoadEvent } from '../../routes/[language]/$types';
import type { Tag } from '../models/Video';

export const getSimilar = async (fetch: PageLoadEvent['fetch'], text: string): Promise<Tag> => {
	const response = await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/tags/similar/${text}`);
	return await response.json();
};
