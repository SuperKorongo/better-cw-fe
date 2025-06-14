<script lang="ts">
	import { PUBLIC_DIRECT_LINK_AD_SRC } from '$env/static/public';
	import type { Video } from '$lib/models/Video';
	import { addView } from '$lib/services/videos';

	let {
		video
	}: {
		video: Video;
	} = $props();

	const onPlayVideo = (e: MouseEvent) => {
		addView(video.uuid);
		if (PUBLIC_DIRECT_LINK_AD_SRC) {
			window.open(PUBLIC_DIRECT_LINK_AD_SRC, '_blank');
		}
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
