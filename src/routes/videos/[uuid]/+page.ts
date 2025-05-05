import { getEmpty as getEmptyVideo, type Video } from '$lib/models/Video';
import { getVideoByUUID } from '$lib/services/videos';
import { handleApiError } from '$lib/utils/utils';
import type { PageLoadEvent } from '../../$types';

export const prerender = false;

export type Data = { video: Video; error: boolean };
export async function load(e: PageLoadEvent): Promise<Data> {
	const params = e.params as { uuid: string };

	try {
		const video = await getVideoByUUID(e.fetch, params.uuid);

		return { video, error: false };
	} catch (e: unknown) {
		// todo: do toasts even work in page.ts code? CHECK IT
		handleApiError(e);
		return { video: getEmptyVideo(), error: true };
	}
}
