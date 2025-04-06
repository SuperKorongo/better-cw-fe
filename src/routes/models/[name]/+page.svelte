<script lang="ts">
	import { page } from '$app/state';
	import Thumbnails from '$lib/components/thumbnails/Thumbnails.svelte';

	import { goto } from '$app/navigation';
	import Header from '$lib/components/header/Header.svelte';
	import type { Pagination } from '$lib/models/Pagination';
	import { type Video as VideoType } from '$lib/models/Video';
	import { getVideosBy, MODELS_ENDPOINT } from '$lib/services/videos';
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
		return getVideosBy(fetch, MODELS_ENDPOINT, params.name, pagination, $search.value ?? '');
	};

	onMount(() => {
		if (data.error) {
			goto('/');
			return;
		}
	});
</script>

<Header subject={getTranslation('headers.model')} value={page.params.name} />

{#if !data.error}
	<Thumbnails videos={data.videos} {getVideosFunc} />
{/if}

<style>
</style>
