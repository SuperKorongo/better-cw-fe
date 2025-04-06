import * as toasts from '$lib/components/toasts/toasts';
import { getEmpty as getEmptyVideo, type Video } from '$lib/models/Video';
import { getVideoByUUID } from '$lib/services/videos';
import { getTranslation } from '$lib/translations';
import type { PageLoadEvent } from '../../$types';

export const prerender = false;

export type Data = { video: Video; error: boolean };
export async function load(e: PageLoadEvent): Promise<Data> {
	const params = e.params as { uuid: string };

	try {
		const video = await getVideoByUUID(e.fetch, params.uuid);

		return { video, error: false };
	} catch {
		toasts.error(getTranslation('common.errors.generic'));
		return { video: getEmptyVideo(), error: true };
	}
}
