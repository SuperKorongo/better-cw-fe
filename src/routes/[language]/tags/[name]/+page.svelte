<script lang="ts">
	import { page } from '$app/state';
	import Videos from '$lib/components/videos/Videos.svelte';

	import { goto } from '$app/navigation';
	import Header from '$lib/components/header/Header.svelte';
	import type { GetVideosFunc, GetVideosFuncParams } from '$lib/components/videos/events';
	import { type Video as VideoType } from '$lib/models/Video';
	import { getVideosBy, TAGS_ENDPOINT } from '$lib/services/videos';
	import { language } from '$lib/stores/language/store';
	import { search } from '$lib/stores/search/store';
	import { getTranslation } from '$lib/translations';
	import { onMount } from 'svelte';
	import type { Data } from './+page';

	let {
		data
	}: {
		data: Data;
	} = $props();

	let getVideosFunc: GetVideosFunc = (params: GetVideosFuncParams): Promise<VideoType[]> => {
		const pageParams = page.params as { name: string };
		return getVideosBy(
			fetch,
			TAGS_ENDPOINT,
			pageParams.name,
			params.pagination,
			$search.value ?? '',
			params.filters
		);
	};

	onMount(() => {
		if (data.error) {
			goto(`/${$language}`);
			return;
		}
	});

	function getTagName(): string {
		return data.videos && data.videos.length
			? data.videos[0].tags.find((t) => t.slug === page.params.name)?.name ||
					(page.params.name as string)
			: (page.params.name as string);
	}
</script>

<svelte:head>
	<meta
		name="description"
		content={getTranslation('homepage.metaDescriptionTagPage').replace('$TAG', getTagName()) +
			' ' +
			getTranslation('homepage.metaDescription')}
	/>
</svelte:head>

<Header subject={getTranslation('headers.tag')} value={getTagName()} />
<article>
	<h2>👀{getTranslation('homepage.metaDescriptionTagPage').replace('$TAG', getTagName())}</h2>
</article>

{#if !data.error}
	<Videos videos={data.videos} {getVideosFunc} />
{/if}

<style>
	article {
		text-align: center;
	}
</style>
