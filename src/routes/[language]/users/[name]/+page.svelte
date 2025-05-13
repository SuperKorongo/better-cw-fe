<script lang="ts">
	import { page } from '$app/state';
	import Thumbnails from '$lib/components/thumbnails/Thumbnails.svelte';

	import { goto } from '$app/navigation';
	import StarRating from '$lib/components/common/StarRating.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import type { Pagination } from '$lib/models/Pagination';
	import { type Video as VideoType } from '$lib/models/Video';
	import { getVideosBy, USERS_ENDPOINT } from '$lib/services/videos';
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
		return getVideosBy(fetch, USERS_ENDPOINT, params.name, pagination, $search.value ?? '');
	};

	onMount(() => {
		if (data.error) {
			goto(`/${$language}`);
			return;
		}
	});

	function getUserName(): string {
		return data.videos && data.videos.length ? data.videos[0].uploader.name : page.params.name;
	}
</script>

<svelte:head>
	<meta
		name="description"
		content={getTranslation('homepage.metaDescriptionUserPage').replace('$USER', getUserName()) +
			' ' +
			getTranslation('homepage.metaDescription')}
	/>
</svelte:head>

<Header subject={getTranslation('headers.member')} value={getUserName()} />
<div class="user-rating">
	{#if !data.error && data.videos.length > 0}
		<span>{getTranslation('homepage.userRating')}</span>
		<StarRating size={50} value={data.videos[0].uploader.rating} totalStars={5} />
	{/if}
</div>

{#if !data.error}
	<Thumbnails videos={data.videos} {getVideosFunc} />
{/if}

<style>
	.user-rating {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		margin-bottom: 20px;
		font-variant: small-caps;
	}
</style>
