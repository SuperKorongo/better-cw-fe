<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';

	import type { Tag, Video } from '$lib/models/Video';
	import { getSimilar } from '$lib/services/tags';
	import { language } from '$lib/stores/language/store';
	import { loading } from '$lib/stores/loading/store';
	import { orderBy } from '$lib/stores/order_by/store';
	import { filters, TEXT_FILTER_QUERY_PARAM } from '$lib/stores/video_filters/store';
	import { getTranslation } from '$lib/translations';
	import { isAdblockPresent } from '$lib/utils/utils';
	import AdBanner from '../../ad-banner/AdBanner.svelte';
	import GlowingText from '../../common/GlowingText.svelte';
	import Thumbnail from '../../thumbnail/Thumbnail.svelte';
	import { events, type GetVideosFunc } from '../events';
	import OrderBy from '../OrderBy.svelte';

	let {
		videos,
		getVideosFunc
	}: {
		videos: Video[];
		getVideosFunc: GetVideosFunc;
	} = $props();

	let shouldDisplayLoadMoreVideosButton: boolean = $state(true);
	let mounted: boolean = $state(false);
	let hasAdBlock: boolean = $state(false);
	let noVideosFound: boolean = $state(false);
	let similarSearchText: string = $state('');

	const { onClickLoadMore, onOrderByChanged } = events(() => videos, getVideosFunc);

	onMount(async () => {
		hasAdBlock = await isAdblockPresent();
		mounted = true;
	});

	$effect(() => {
		shouldDisplayLoadMoreVideosButton = true;
		noVideosFound = false;
		if (videos) {
			loading.set(false);
		}
	});

	function addNewVideos(result: { videos: Video[]; error: Error | null }) {
		if (result.error !== null) {
			return;
		}

		if (result.videos.length === 0) {
			shouldDisplayLoadMoreVideosButton = false;
			return;
		}

		videos.push(...result.videos);
		videos = Array.from(videos);
	}

	function setNewVideos(newVideos: Video[]) {
		videos = Array.from(newVideos);

		shouldDisplayLoadMoreVideosButton = true;
	}

	function onClickAlternative(alternative: string) {
		loading.set(true);
		document.location.href = `/${$language}?${TEXT_FILTER_QUERY_PARAM}=${alternative}`;
	}

	$effect(() => {
		onOrderByChanged($orderBy, setNewVideos);
	});

	$effect(() => {
		if (videos.length === 0) {
			noVideosFound = true;
		}

		if (videos.length === 0 && $filters.text) {
			getSimilar(window.fetch, $filters.text).then((tag: Tag) => {
				similarSearchText = tag.name;
			});
		}
	});
</script>

<section>
	<div class="filters-container">
		<OrderBy />
	</div>
	{#if noVideosFound}
		<div class="no-videos-found">
			<span class="no-results-text">
				{getTranslation('homepage.noResults')}
				{$filters.text} 😔
			</span>
			{#if similarSearchText}
				<span class="alternative-text">
					{getTranslation('homepage.noResultsAlternative')}
					<span
						onkeypress={() => {
							onClickAlternative(similarSearchText);
						}}
						tabindex="-1"
						role="link"
						onclick={() => {
							onClickAlternative(similarSearchText);
						}}
						class="alternative"
					>
						<GlowingText text={similarSearchText} />
					</span>? 🔥🔥
				</span>
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
			{#if shouldDisplayLoadMoreVideosButton && !noVideosFound}
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
			{:else}
				<span>{getTranslation('common.noMoreVideos')}</span>
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

	.no-videos-found {
		text-align: center;
		border-radius: 10px;
		padding: 30px 10px;
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		margin-bottom: 25px;
	}

	.no-results-text,
	.alternative-text {
		font-weight: bold;
		font-size: 25px;
		display: block;
		margin-bottom: 30px;
		text-shadow: 1px 1px 3px black;
	}

	.alternative-text {
		margin-bottom: 0px;
	}
	.alternative {
		text-shadow: none;
		cursor: pointer;
		font-size: 35px;
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
