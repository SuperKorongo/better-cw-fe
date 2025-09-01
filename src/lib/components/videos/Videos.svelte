<script lang="ts">
	import type { Video } from '$lib/models/Video';
	import { type GetVideosFunc } from './events';
	import Thumbnails from './thumbnails/Thumbnails.svelte';

	let {
		videos,
		getVideosFunc
	}: {
		videos: Video[];
		getVideosFunc: GetVideosFunc;
	} = $props();
</script>

<main class="container">
	<div class="thumbnails">
		<Thumbnails {videos} {getVideosFunc} />
	</div>
</main>
