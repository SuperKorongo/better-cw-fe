<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';

	import type { Video } from '$lib/models/Video';
	import { loading } from '$lib/stores/loading/store';
	import { orderBy } from '$lib/stores/order_by/store';
	import { search } from '$lib/stores/search/store';
	import { getTranslation } from '$lib/translations';
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

	const { onScroll, onClickLoadMore, onOrderByChanged, onSearchChanged, onToggleFreeVideosOnly } =
		events(
			() => $orderBy,
			() => {
				return { freeVideosOnly };
			},
			() => videos,
			getVideosFunc
		);

	onMount(() => {
		window.onscroll = () => onScroll(addNewVideos, !noMoreVideos);
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
		onSearchChanged($search.value ?? '', setNewVideos);
	});

	$effect(() => {
		onToggleFreeVideosOnly(freeVideosOnly, setNewVideos);
	});
</script>

<section>
	<div class="filters-container">
		<OrderBy />
		<FreeOnlyToggle bind:value={freeVideosOnly} />
	</div>
	<div class="thumbnails-container">
		<AdBanner />
		{#each videos as video (video.uuid)}
			<Thumbnail {video} />
		{/each}
	</div>
	<div class="load-more-container">
		{#if noMoreVideos}
			<span>{getTranslation('common.noMoreVideos')}</span>
		{:else}
			<Button onclick={() => onClickLoadMore(addNewVideos)} variant="raised" color="secondary">
				<Label>{getTranslation('homepage.loadMore')}</Label>
			</Button>
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
