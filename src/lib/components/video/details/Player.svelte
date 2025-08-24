<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Video } from '$lib/models/Video';
	import { addView } from '$lib/services/videos';
	import { getTranslation } from '$lib/translations';
	import { isAdblockPresent, openAdLink } from '$lib/utils/utils';

	let {
		video
	}: {
		video: Video;
	} = $props();

	const onPlayVideo = async (e: MouseEvent) => {
		if (await isAdblockPresent()) {
			toasts.warning(getTranslation('video.deactivateAdblock'), { duration: 999999 });
			return;
		}

		addView(window.fetch, video.uuid);
		openAdLink();
		(e.target as HTMLDivElement).style.display = 'none';
	};
</script>

<div class="container">
	<div role="none" onclick={onPlayVideo} class="click-handler"></div>
	<iframe
		title={video.title}
		width="100%"
		height="500"
		frameborder="0"
		src={`https://mega.nz/embed/${video.downloadLink}`}
		allowfullscreen
	></iframe>
</div>

<style>
	.click-handler {
		background-color: rgba(0, 0, 0, 0);
		width: 100%;
		height: 500px;
		position: fixed;
	}
</style>
