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

	let allImagesLoaded: boolean = $state(false);
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
						allImagesLoaded = true;
					}
				};
				img.onload = () => {
					if (img.naturalWidth > img.naturalHeight) {
						imagesLoaded++;
						imageSrcs.push(src);
						if (imagesLoaded === imageUrls.length) {
							allImagesLoaded = true;
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
							allImagesLoaded = true;
						}
					}, 'image/png');
				};
			})(img);
		}
	});
</script>

<div class="carousel-container">
	{#if allImagesLoaded}
		<Carousel autoplayDuration={0} duration={2500} autoplay timingFunction="linear" arrows={false}>
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
		<div class="loading-images">
			<div class="inner"><div class="loader"></div></div>
		</div>
	{/if}
</div>

<style>
	.carousel-container {
		margin-top: 40px;
		position: relative;
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
		.loading-images {
			height: 250px;
		}
	}
	@media (min-width: 600px) {
		.carousel-image,
		.loading-images {
			height: 500px;
		}
	}
	@media (min-width: 1921px) {
		.carousel-image,
		.loading-images {
			height: 650px;
		}
	}
	@media (min-width: 2500px) {
		.carousel-image,
		.loading-images {
			height: 800px;
		}
	}

	.inner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -100%);
	}
	.loader {
		width: 50px;
		aspect-ratio: 1;
		border-radius: 50%;
		border: 8px solid;
		border-color: #fff #fff0;
		animation: l1 1s infinite;
	}
	@keyframes l1 {
		to {
			transform: rotate(0.5turn);
		}
	}
</style>
