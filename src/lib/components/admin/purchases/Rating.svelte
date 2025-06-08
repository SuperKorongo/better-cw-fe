<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { rateFreeVideo, ratePaidVideo } from '$lib/services/admin/videos';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { handleApiError } from '$lib/utils/utils';
	import Button, { Label } from '@smui/button';
	import Slider from '@smui/slider';
	import { Rating, Star } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	const DEFAULT_RATNG = 4.5;
	const LOCAL_STORAGE_KEY = 'user-rated-videos';

	let {
		size = 25,
		totalStars = 5,
		rating = null,
		invoiceUUID = null,
		videoUUID
	}: {
		size?: number;
		totalStars?: number;
		rating?: number | null;
		invoiceUUID?: string | null;
		videoUUID: string;
	} = $props();

	type RatedVideo = {
		uuid: string;
		rating: number;
	};

	let ratingValue = $state(rating ?? DEFAULT_RATNG);
	let alreadyRatedVideos = $state<RatedVideo[]>([]);

	onMount(() => {
		const ratedVideos = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!ratedVideos) {
			return;
		}
		alreadyRatedVideos = JSON.parse(ratedVideos);
		const ratedVideo = alreadyRatedVideos.find((v) => v.uuid === videoUUID);
		if (ratedVideo) {
			rating = ratedVideo.rating;
		}
	});

	const onSuccessfulRating = () => {
		rating = ratingValue;
		alreadyRatedVideos.push({ uuid: videoUUID, rating: ratingValue });
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(alreadyRatedVideos));
		toasts.success(getTranslation('purchases.details.successfullyRated'));
	};

	const onRateVideo = async () => {
		if ($loading.value) {
			return;
		}
		try {
			loading.set(true);
			if (invoiceUUID) {
				await ratePaidVideo(invoiceUUID, videoUUID, ratingValue);
				cacheInvalidation.refreshMyPurchases();
			} else {
				await rateFreeVideo(videoUUID, ratingValue);
			}
			onSuccessfulRating();
		} catch (e: unknown) {
			const funcMap = new Map<number, () => void>();
			funcMap.set(409, () => {
				// User already rated this video
				onSuccessfulRating();
			});
			handleApiError(e, 'common.errors.generic', funcMap);
		} finally {
			loading.set(false);
		}
	};
</script>

<div class="rating-container">
	{#if rating === null}
		<span class="rate-text">
			{getTranslation('purchases.details.rateTheVideo')}<br />
			<span class="rating-value">{ratingValue} / 5 ⭐</span>
		</span>
		<div class="slider-container">
			<Slider
				bind:value={ratingValue}
				min={0}
				max={5}
				step={0.25}
				discrete
				input$aria-label="Rating slider"
			/>
			<Button onclick={onRateVideo} variant="raised" color="secondary">
				<Label>{getTranslation('purchases.details.submit')}</Label>
			</Button>
		</div>
	{:else}
		<span>{getTranslation('purchases.details.yourRating')}</span>
		<Rating icon={Star} total={totalStars} {size} {rating} />
	{/if}
</div>

<style>
	.rate-text {
		display: block;
	}
	.slider-container {
		display: grid;
		grid-template-columns: 70% 30%;
	}
	.rating-value {
		font-size: 13px;
		font-style: italic;
		color: #888;
	}
</style>
