<script lang="ts">
	import { getImageSrc } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	// @ts-expect-error - Missing TS declarations.
	import Carousel from 'svelte-carousel';

	let {
		imageUrls,
		onClickImage
	}: {
		imageUrls: string[];
		onClickImage: (imageUrl: string) => void;
	} = $props();

	let isMounted: boolean = $state(false);
	onMount(() => {
		isMounted = true;
		if (imageUrls.length === 0) {
			imageUrls.push('placeholder');
		}
	});
</script>

<div class="carousel-container">
	{#if isMounted}
		<Carousel autoplayDuration={0} duration={3000} autoplay timingFunction="linear" arrows={false}>
			{#each imageUrls as src (src)}
				<img
					role="none"
					onclick={() => onClickImage(src)}
					class="carousel-image"
					src={getImageSrc(src)}
					alt={src}
				/>
			{/each}
		</Carousel>
	{:else}
		<div class="placeholder"></div>
	{/if}
</div>

<style>
	.carousel-container {
		margin-top: 40px;
	}
	.carousel-container :global(.sc-carousel__pages-window) {
		box-shadow: 0 0 9px 2px black;
		border-radius: 20px;
	}
	.carousel-image {
		width: 100%;
	}

	@media (max-width: 600px) {
		.carousel-image,
		.placeholder {
			height: 250px;
		}
	}
	@media (min-width: 600px) {
		.carousel-image,
		.placeholder {
			height: 500px;
		}
	}
	@media (min-width: 1921px) {
		.carousel-image,
		.placeholder {
			height: 650px;
		}
	}
	@media (min-width: 2500px) {
		.carousel-image,
		.placeholder {
			height: 800px;
		}
	}
</style>
