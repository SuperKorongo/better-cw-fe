<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import HeaderTexts from '$lib/components/header-texts/HeaderTexts.svelte';
	import Video from '$lib/components/video/Video.svelte';
	import type { GetVideosFunc, GetVideosFuncParams } from '$lib/components/videos/events';
	import Videos from '$lib/components/videos/Videos.svelte';
	import { DEFAULT_PAGINATION } from '$lib/models/Pagination';
	import { type Video as VideoType } from '$lib/models/Video';
	import { getHomepageVideos } from '$lib/services/videos';
	import { language } from '$lib/stores/language/store';
	import { getTranslation } from '$lib/translations';
	import { getBrandName } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import type { Data } from './+page';

	let { data } = $props();

	let mounted: boolean = $state(false);
	let homepageVideos: Data['video'][] = $state(Array(25));

	onMount(async () => {
		if (data.error) {
			goto(`/${$language}`);
			return;
		}
		homepageVideos = await getHomepageVideos(window.fetch, DEFAULT_PAGINATION, '', null);
		mounted = true;
	});

	const getVideosFunc: GetVideosFunc = (params: GetVideosFuncParams): Promise<VideoType[]> => {
		return getHomepageVideos(fetch, params.pagination, '', params.filters);
	};
</script>

<svelte:head>
	{#if !data.error}
		<title>
			{data.video.price.value === 0 ? `${getTranslation('homepage.watchForFree')} | ` : ''}{data
				.video.title} - {getBrandName('short')}
		</title>
	{/if}
</svelte:head>
{#key page.state}
	{#if page.state.selectedVideo}
		<Video video={page.state.selectedVideo} />
	{:else if !data.error}
		<HeaderTexts />
		<Video video={data.video} />
	{/if}
{/key}

{#key mounted}
	{#if mounted}
		<Videos videos={homepageVideos} {getVideosFunc} />
	{/if}
{/key}
