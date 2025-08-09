<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';

	import { page } from '$app/state';
	import type { Tag, Video } from '$lib/models/Video';
	import { getSimilar } from '$lib/services/tags';
	import { loading } from '$lib/stores/loading/store';
	import { orderBy } from '$lib/stores/order_by/store';
	import { getFromUrl as getInputSearchFromUrl } from '$lib/stores/search/store';
	import { getTranslation } from '$lib/translations';
	import { isAdblockPresent } from '$lib/utils/utils';
	import AdBanner from '../ad-banner/AdBanner.svelte';
	import Thumbnail from '../thumbnail/Thumbnail.svelte';
	import { events, type GetVideosFunc } from './events';
	import FreeOnlyToggle from './FreeOnlyToggle.svelte';
	import OrderBy from './OrderBy.svelte';

	let {
		videos,
		getVideosFunc
	}: {
		videos: Video[];
		getVideosFunc: GetVideosFunc;
	} = $props();

	let noMoreVideos: boolean = $state(false);
	let freeVideosOnly: boolean = $state(false);
	let mounted: boolean = $state(false);
	let hasAdBlock: boolean = $state(false);
	let noVideosFound: boolean = $state(false);
	let similarSearchText: string = $state('');

	const { onScroll, onClickLoadMore, onOrderByChanged, onToggleFreeVideosOnly } = events(
		() => $orderBy,
		() => {
			return { freeVideosOnly };
		},
		() => videos,
		getVideosFunc
	);

	onMount(async () => {
		window.onscroll = () => onScroll(addNewVideos, !noMoreVideos);
		hasAdBlock = await isAdblockPresent();
		mounted = true;
	});

	$effect(() => {
		if (videos) {
			loading.set(false);
		}
	});

	function addNewVideos(result: { videos: Video[]; error: Error | null }) {
		if (result.error !== null) {
			return;
		}

		if (result.videos.length === 0) {
			noMoreVideos = true;
			return;
		}

		videos.push(...result.videos);
		videos = Array.from(videos);
	}

	function setNewVideos(newVideos: Video[]) {
		videos = Array.from(newVideos);

		noMoreVideos = false;
	}

	$effect(() => {
		onOrderByChanged($orderBy, setNewVideos);
	});

	$effect(() => {
		onToggleFreeVideosOnly(freeVideosOnly, setNewVideos);
	});

	$effect(() => {
		if (videos.length === 0) {
			noVideosFound = true;
		}

		const searchQueryParam = getInputSearchFromUrl(page.url);
		if (videos.length === 0 && searchQueryParam) {
			getSimilar(window.fetch, searchQueryParam).then((tag: Tag) => {
				similarSearchText = tag.name;
			});
		}
	});
</script>

<section>
	<div class="filters-container">
		<OrderBy />
		<FreeOnlyToggle bind:value={freeVideosOnly} />
	</div>
	{#if noVideosFound}
		<div class="no-videos-found">
			TODO: Finish this <br />No results found :(
			{#if similarSearchText}
				<br />
				Perhaps you are looking for {similarSearchText}?
			{/if}
		</div>
	{/if}
	<div class="thumbnails-container">
		<AdBanner />
		{#each videos as video (video.uuid)}
			<Thumbnail {video} />
		{/each}
	</div>
	<div class="load-more-container">
		{#if mounted}
			{#if noMoreVideos}
				<span>{getTranslation('common.noMoreVideos')}</span>
			{:else}
				<Button
					aria-describedby="loadMoreDisclaimer"
					onclick={() => onClickLoadMore(addNewVideos)}
					variant="raised"
					color="secondary"
				>
					<Label>
						{getTranslation(hasAdBlock ? 'homepage.loadMore' : 'homepage.loadMoreWithoutAdBlock')}
					</Label>
				</Button>
				<span id="loadMoreDisclaimer">
					{#if !hasAdBlock}
						{getTranslation('homepage.loadMoreAdDisclaimer')}
					{/if}
				</span>
			{/if}
		{/if}
	</div>
</section>

<style>
	section,
	section :global(*) {
		--column-gap: 1.5rem;
		--row-gap: 5em;
		--thumbnail-width: 300px;
		--thumbnail-height: 250px;
		--thumbnail-border-radius: 20px;
	}

	section {
		--padding: calc(var(--column-gap) * 1.5);
	}

	.thumbnails-container {
		width: 100%;
		display: grid;
		column-gap: var(--column-gap);
		row-gap: var(--row-gap);
		place-content: space-around;
	}

	.load-more-container {
		margin-top: 100px;
		text-align: center;
	}

	.filters-container {
		display: flex;
		align-items: baseline;
		margin-bottom: 20px;
		background: rgba(0, 0, 0, 0.463);
		width: fit-content;
		border-radius: 15px;
		padding: 0px 10px;
	}

	#loadMoreDisclaimer {
		display: block;
		margin-top: 10px;
		font-size: 13px;
		color: #bbb;
	}

	@media (max-width: 600px) {
		.thumbnails-container {
			grid-template-columns: repeat(1, 100%);
		}
		section {
			padding: calc(var(--navbar-height) + var(--padding)) 10px;
			padding-top: 0;
		}
	}
	@media (min-width: 600px) {
		.thumbnails-container {
			grid-template-columns: repeat(auto-fit, minmax(var(--thumbnail-width), auto));
		}
		section {
			padding: calc(var(--navbar-height) + var(--padding)) var(--padding);
			padding-top: 0;
		}
	}
</style>
