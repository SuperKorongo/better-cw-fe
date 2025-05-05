import type { DisputeVideo } from '$lib/models/Dispute';
import { getVideoByUUID } from '$lib/services/videos';
import { loading } from '$lib/stores/loading/store';
import { handleApiError, showVideoSidePanel } from '$lib/utils/utils';

export const onClickVideo = async (e: MouseEvent, video: DisputeVideo): Promise<void> => {
	e.stopPropagation();
	e.preventDefault();
	try {
		loading.set(true);
		const target = e.currentTarget as HTMLAnchorElement;
		showVideoSidePanel(e, target, await getVideoByUUID(window.fetch, video.uuid));
	} catch (e: unknown) {
		handleApiError(e);
	} finally {
		loading.set(false);
	}
};
