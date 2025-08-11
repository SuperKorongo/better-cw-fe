<script lang="ts">
	import type { Video } from '$lib/models/Video';
	import { type GetVideosFunc } from './events';
	import SidePanel from './side-panel/SidePanel.svelte';
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
	<SidePanel />
	<Thumbnails {videos} {getVideosFunc} />
</main>

<style>
</style>
