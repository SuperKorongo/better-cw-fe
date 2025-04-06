<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import Thumbnails from '$lib/components/thumbnails/Thumbnails.svelte';
	import type { Pagination } from '$lib/models/Pagination';

	import { getHomepageVideos } from '$lib/services/videos';
	import { search } from '$lib/stores/search/store';
	import type { Data } from './+page';

	let {
		data
	}: {
		data: Data;
	} = $props();

	const getVideosFunc = (pagination: Pagination) =>
		getHomepageVideos(fetch, pagination, $search.value ?? '');
</script>

<Header mainText="TODO: Some cool and short description" />

{#if !data.error}
	<Thumbnails videos={data.videos} {getVideosFunc} />
{/if}
