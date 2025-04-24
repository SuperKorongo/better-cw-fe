<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Slider from '@smui/slider';
	import { Rating, Star } from 'flowbite-svelte';

	let {
		size = 25,
		totalStars = 5,
		rating = 3.5
	}: {
		size?: number;
		totalStars?: number;
		rating?: number | null;
	} = $props();

	let ratingValue = $state(rating ?? 3);

	const onRateVideo = () => {
		// todo: api call
		rating = ratingValue;
	};
</script>

<div class="rating-container">
	{#if rating === null}
		<span class="rate-text">Rate the video <br /> ({ratingValue}/5 ⭐)</span>
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
				<Label>Submit</Label>
			</Button>
		</div>
	{:else}
		<span>Your rating</span>
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
