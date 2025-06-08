<script lang="ts">
	import type { Video } from '$lib/models/Video';
	import { addView } from '$lib/services/videos';

	let {
		video
	}: {
		video: Video;
	} = $props();

	const onPlayVideo = (e: MouseEvent) => {
		addView(video.uuid);
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
