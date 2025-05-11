import { getEmpty as getEmptyVideo, type Video } from '$lib/models/Video';
import { getVideoByUUID } from '$lib/services/videos';
import type { PageLoadEvent } from './$types';

export const prerender = false;

export type Data = { video: Video; error: boolean };
export async function load(e: PageLoadEvent): Promise<Data> {
	const params = e.params as { uuid: string };

	try {
		const video = await getVideoByUUID(e.fetch, params.uuid);

		return { video, error: false };
	} catch (e: unknown) {
		console.error(e);
		return { video: getEmptyVideo(), error: true };
	}
}
