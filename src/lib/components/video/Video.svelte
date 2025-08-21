<script lang="ts">
	import { onMount } from 'svelte';
	import { swipe } from 'svelte-gestures';

	import type { Video } from '$lib/models/Video';
	import { loading } from '$lib/stores/loading/store';
	import Carousel from './Carousel.svelte';
	import CloseButton from './CloseButton.svelte';
	import Details from './details/Details.svelte';
	import Player from './details/Player.svelte';
	import { events } from './events';
	import FriendsOnlyOverlay from './FriendsOnlyOverlay.svelte';
	import ImageModal from './ImageModal.svelte';
	import Overlay from './Overlay.svelte';

	let {
		video
	}: {
		video: Video;
	} = $props();

	let modalImageUrl: string = $state('');
	let container: HTMLElement;

	const { onExit, onClose, onSwipe, onClickCarouselImage, onCloseImageModal } = events(
		() => container,
		(url: string) => (modalImageUrl = url)
	);

	onMount(() => {
		document.body.style.overflowY = 'hidden';
		window.addEventListener('popstate', onExit);
	});
</script>

<Overlay onClick={onClose} />

<aside
	use:swipe={() => ({ timeframe: 300, minSwipeDistance: 100, touchAction: 'pan-y' })}
	onswipe={onSwipe}
	bind:this={container}
>
	<CloseButton onClick={onClose} />
	<main>
		<h1>{video.model?.name}</h1>
		<article>
			<h2>{video.title}</h2>
			{#if video.isPrivate}
				{#if $loading.value}
					<div class="loading-placeholder"></div>
				{/if}
				<FriendsOnlyOverlay
					onClickWatchVideo={(link: string) => {
						video = {
							...video,
							downloadLink: link,
							isPrivate: false
						};
					}}
					{video}
				/>
				<Carousel onClickImage={onClickCarouselImage} imageUrls={video.thumbnailFilePaths} />
			{/if}

			{#if !video.isPrivate}
				{#if video.price.value}
					<Carousel onClickImage={onClickCarouselImage} imageUrls={video.thumbnailFilePaths} />
				{:else}
					<Player {video} />
				{/if}
			{/if}
			<Details {video} />
		</article>
	</main>
</aside>

{#if modalImageUrl}
	<ImageModal imageUrl={modalImageUrl} onClose={onCloseImageModal} />
{/if}

<style>
	aside {
		z-index: 2;
		box-shadow: 0px 0px 25px 20px black;
		position: fixed;
		height: 100%;
		background: linear-gradient(
			180deg,
			rgba(210, 0, 0, 1) 0%,
			rgba(102, 0, 0, 1) 47%,
			rgba(28, 5, 82, 1) 100%
		);

		animation-duration: 0.3s;
		animation-fill-mode: forwards;

		overflow-y: auto;
		overflow-x: hidden;
	}

	@keyframes expand-right-to-left {
		0% {
			right: -50%;
		}
		100% {
			right: 0%;
		}
	}
	@keyframes hide-left-to-right {
		0% {
			right: 0%;
		}
		100% {
			right: -55%;
		}
	}
	@keyframes expand-bottom-to-top {
		0% {
			bottom: -100%;
		}
		100% {
			bottom: 0%;
		}
	}
	@keyframes hide-bottom-to-top {
		0% {
			bottom: 0%;
		}
		100% {
			bottom: -105%;
		}
	}

	@media (max-width: 1100px) {
		aside {
			width: 100%;
			animation-name: expand-bottom-to-top;
		}
		h1 {
			font-size: 25px;
		}
		h2 {
			font-size: 20px;
		}
	}
	@media (min-width: 1100px) {
		aside {
			top: 0%;
			width: 50%;
			animation-name: expand-right-to-left;
		}
		h1 {
			font-size: 40px;
		}
		h2 {
			font-size: 25px;
		}
	}

	h1,
	h2 {
		text-shadow: 1px 1px 1px black;
	}
	h1 {
		text-align: center;
		margin: 15px 0px;
	}
	article {
		padding: 5px 20px;
	}

	@media (max-width: 600px) {
		.loading-placeholder {
			height: 250px;
		}
	}
	@media (min-width: 600px) {
		.loading-placeholder {
			height: 500px;
		}
	}
	@media (min-width: 1921px) {
		.loading-placeholder {
			height: 650px;
		}
	}
	@media (min-width: 2500px) {
		.loading-placeholder {
			height: 800px;
		}
	}
</style>
