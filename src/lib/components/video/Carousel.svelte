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
	let imageSrcs: string[] = [];
	onMount(() => {
		if (imageUrls.length === 0) {
			imageUrls.push('placeholder');
		}

		let imagesLoaded = 0;
		for (const imageUrl of imageUrls) {
			let src = getImageSrc(imageUrl);

			const img = document.createElement('img');
			img.setAttribute('src', src);
			img.setAttribute('crossOrigin', 'anonymous');
			img.style.display = 'none';

			(function (img) {
				img.onerror = () => {
					imagesLoaded++;
					if (imagesLoaded === imageUrls.length) {
						isMounted = true;
					}
				};
				img.onload = () => {
					if (img.naturalWidth > img.naturalHeight) {
						imagesLoaded++;
						if (imagesLoaded === imageUrls.length) {
							isMounted = true;
						}
						return;
					}

					const canvas = document.createElement('canvas');
					canvas.width = 800;
					canvas.height = 600;
					const ctx = canvas.getContext('2d')!;

					ctx.fillStyle = 'black';
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					ctx.drawImage(img, 275, 0, 275, 600);

					canvas.toBlob(function (blob) {
						imageSrcs.push(URL.createObjectURL(blob!));
						imagesLoaded++;
						if (imagesLoaded === imageUrls.length) {
							isMounted = true;
						}
					}, 'image/png');
				};
			})(img);
		}
	});
</script>

<div class="carousel-container">
	{#if isMounted}
		<Carousel autoplayDuration={0} duration={5000} autoplay timingFunction="linear" arrows={false}>
			{#each imageUrls as src, index (src)}
				<img
					role="none"
					onclick={() => onClickImage(src)}
					class="carousel-image"
					src={imageSrcs[index]}
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
