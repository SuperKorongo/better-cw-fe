<script lang="ts">
	import GlowingText from '$lib/components/common/GlowingText.svelte';
	import type { GetVideosFunc, GetVideosFuncParams } from '$lib/components/thumbnails/events';
	import Thumbnails from '$lib/components/thumbnails/Thumbnails.svelte';
	import { type Video as VideoType } from '$lib/models/Video';

	import { getHomepageVideos } from '$lib/services/videos';
	import { search } from '$lib/stores/search/store';
	import { getTranslation } from '$lib/translations';
	import type { Data } from './+page';

	let {
		data
	}: {
		data: Data;
	} = $props();

	const getVideosFunc: GetVideosFunc = (params: GetVideosFuncParams): Promise<VideoType[]> => {
		return getHomepageVideos(fetch, params.pagination, $search.value ?? '', params.filters);
	};
</script>

<header>
	<h1>
		<GlowingText text="Clipz 4 BTC" />
	</h1>
	<h2>{getTranslation('homepage.title')}</h2>
	<h3>{getTranslation('homepage.subTitle')}</h3>
	<section class="description">
		{getTranslation('homepage.desc1')}<br />
		{getTranslation('homepage.desc2')}<br />
		{getTranslation('homepage.desc3')}<br />
		{getTranslation('homepage.desc4')}<br />
	</section>
</header>

{#if !data.error}
	<Thumbnails videos={data.videos} {getVideosFunc} />
{/if}

<style>
	header {
		margin-top: calc(var(--navbar-height) + 40px);
		padding: 0% 3rem;
		margin-bottom: 30px;
	}
	h1,
	h2,
	h3 {
		text-align: center;
	}
	h1 {
		font: 900 clamp(0.875em, 7.25vw, 2.5em) sans-serif;
		font-size: 60px;
		text-align: center;
		text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.24);
		text-transform: uppercase;
	}
	h2 {
		font-size: 40px;
	}
	h3 {
		font-size: 25px;
		text-shadow: 0px 0px 5px rgb(0, 0, 0);
	}
	.description {
		font-size: 18px;
		text-align: center;
		font-weight: bold;
		line-height: 36px;
	}
</style>
