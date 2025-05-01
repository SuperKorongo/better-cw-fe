<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { rateVideo } from '$lib/services/admin/videos';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import Button, { Label } from '@smui/button';
	import Slider from '@smui/slider';
	import { Rating, Star } from 'flowbite-svelte';

	let {
		size = 25,
		totalStars = 5,
		rating = 3.5,
		invoiceUUID,
		videoUUID
	}: {
		size?: number;
		totalStars?: number;
		rating?: number | null;
		invoiceUUID: string;
		videoUUID: string;
	} = $props();

	let ratingValue = $state(rating ?? 3);

	const onRateVideo = async () => {
		if ($loading.value) {
			return;
		}
		try {
			loading.set(true);
			await rateVideo(invoiceUUID, videoUUID, ratingValue);
			rating = ratingValue;
			cacheInvalidation.refreshMyPurchases();
			toasts.success(getTranslation('purchases.details.successfullyRated'));
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
		} finally {
			loading.set(false);
		}
	};
</script>

<div class="rating-container">
	{#if rating === null}
		<span class="rate-text">
			{getTranslation('purchases.details.rateTheVideo')}<br /> ({ratingValue}/5 ⭐)
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
			<Button onclick={onRateVideo} variant="outlined" color="secondary">
				<Label>{getTranslation('purchases.details.submit')}</Label>
			</Button>
		</div>
	{:else}
		<span>{getTranslation('purchases.details.yourRating')}</span>
		<Rating
			iconStrokeColor="black"
			iconFillColor="gold"
			icon={Star}
			total={totalStars}
			{size}
			{rating}
		/>
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
</style>
