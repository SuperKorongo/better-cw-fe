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
	<div class="side-panel">
		<SidePanel />
	</div>
	<div class="thumbnails">
		<Thumbnails {videos} {getVideosFunc} />
	</div>
</main>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 0 auto;
	}

	.side-panel {
		flex: 0 0 20%;
		box-sizing: border-box;
		padding-left: 20px;
	}

	.thumbnails {
		flex: 0 0 80%;
		box-sizing: border-box;
	}

	@media (max-width: 1000px) {
		.side-panel,
		.thumbnails {
			flex: 0 0 100%;
		}
		.side-panel {
			padding-left: 20px;
			padding-right: 20px;
		}
	}
</style>
