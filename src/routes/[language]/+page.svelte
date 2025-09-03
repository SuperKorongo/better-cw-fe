<script lang="ts">
	import HeaderTexts from '$lib/components/header-texts/HeaderTexts.svelte';
	import type { GetVideosFunc } from '$lib/components/videos/events';
	import Videos from '$lib/components/videos/Videos.svelte';
	import type { Pagination } from '$lib/models/Pagination';
	import { type Video as VideoType } from '$lib/models/Video';

	import { getHomepageVideos } from '$lib/services/videos';
	import type { Data } from './+page';

	let {
		data
	}: {
		data: Data;
	} = $props();

	const getVideosFunc: GetVideosFunc = (pagination: Pagination): Promise<VideoType[]> => {
		return getHomepageVideos(fetch, pagination);
	};
</script>

<HeaderTexts />

{#if !data.error}
	<Videos videos={data.videos} {getVideosFunc} />
{:else}
	<div class="backend-error">Internal server error.<br />Please try again later.</div>
{/if}

<style>
	.backend-error {
		margin-top: 100px;
		text-align: center;
		font-size: 40px;
		font-weight: bold;
	}
</style>
