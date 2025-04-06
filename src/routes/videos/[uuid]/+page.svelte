<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Thumbnails from '$lib/components/thumbnails/Thumbnails.svelte';
	import Video from '$lib/components/video/Video.svelte';
	import { DEFAULT_PAGINATION, type Pagination } from '$lib/models/Pagination';
	import { getHomepageVideos } from '$lib/services/videos';
	import { onMount } from 'svelte';
	import type { Data } from './+page';

	let { data } = $props();

	let mounted: boolean = $state(false);
	let homepageVideos: Data['video'][] = $state(Array(25));

	onMount(async () => {
		if (data.error) {
			goto('/');
			return;
		}
		homepageVideos = await getHomepageVideos(window.fetch, DEFAULT_PAGINATION, '');
		mounted = true;
	});

	const getVideosFunc = (pagination: Pagination) => getHomepageVideos(fetch, pagination, '');
</script>

{#key mounted}
	{#if mounted}
		<Thumbnails videos={homepageVideos} {getVideosFunc} />
	{/if}
{/key}

{#key page.state}
	{#if page.state.selectedVideo}
		<Video video={page.state.selectedVideo} />
	{:else if !data.error}
		<Video video={data.video} />
	{/if}
{/key}
