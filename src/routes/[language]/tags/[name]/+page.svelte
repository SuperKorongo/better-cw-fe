<script lang="ts">
	import { page } from '$app/state';
	import Thumbnails from '$lib/components/thumbnails/Thumbnails.svelte';

	import { goto } from '$app/navigation';
	import Header from '$lib/components/header/Header.svelte';
	import type { Pagination } from '$lib/models/Pagination';
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

	let getVideosFunc = (pagination: Pagination): Promise<VideoType[]> => {
		const params = page.params as { name: string };
		return getVideosBy(fetch, TAGS_ENDPOINT, params.name, pagination, $search.value ?? '');
	};

	onMount(() => {
		if (data.error) {
			goto(`/${$language}`);
			return;
		}
	});

	function getTagName(): string {
		return data.videos && data.videos.length
			? data.videos[0].tags.find((t) => t.slug === page.params.name)?.name || page.params.name
			: page.params.name;
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

{#if !data.error}
	<Thumbnails videos={data.videos} {getVideosFunc} />
{/if}

<style>
</style>
