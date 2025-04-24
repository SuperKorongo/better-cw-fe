<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import { Rating, Star } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let {
		size = 25,
		totalStars = 5,
		value = 3.5,
		totalRatings = null
	}: {
		size?: number;
		totalStars?: number;
		value?: number;
		totalRatings?: number | null;
	} = $props();

	let isMounted: boolean = $state(false);

	onMount(() => (isMounted = true));
</script>

{#if isMounted}
	<div class="container">
		<Rating
			iconStrokeColor="white"
			iconFillColor="gold"
			icon={Star}
			total={totalStars}
			{size}
			rating={value}
		/>
		{#if totalRatings !== null}
			<span class="total">
				{value.toFixed(1)} / {totalStars} ({totalRatings}
				{getTranslation('video.totalRatings')})
			</span>
		{/if}
	</div>
{/if}

<style>
	.total {
		font-size: 11px;
		display: inline-block;
		margin-top: -40px;
		margin-left: 3px;
		position: absolute;
		color: #eee;
		font-weight: normal;
		font-style: italic;
	}
</style>
