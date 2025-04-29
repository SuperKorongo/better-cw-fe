import * as toasts from '$lib/components/toasts/toasts';
import type { DisputeVideo } from '$lib/models/Dispute';
import { getVideoByUUID } from '$lib/services/videos';
import { loading } from '$lib/stores/loading/store';
import { getTranslation } from '$lib/translations';
import { showVideoSidePanel } from '$lib/utils/utils';

export const onClickVideo = async (e: MouseEvent, video: DisputeVideo): Promise<void> => {
	e.stopPropagation();
	e.preventDefault();
	try {
		loading.set(true);
		const target = e.currentTarget as HTMLAnchorElement;
		showVideoSidePanel(e, target, await getVideoByUUID(window.fetch, video.uuid));
	} catch (e) {
		toasts.error(getTranslation('common.errors.generic'));
	} finally {
		loading.set(false);
	}
};
