<script lang="ts">
	import { pushState } from '$app/navigation';
	import Button, { Label } from '@smui/button';

	import type { Video } from '$lib/models/Video';
	import { getTranslation } from '$lib/translations';
	import {
		getDurationString,
		getFormattedPrice,
		getImageSrc,
		getPlaceholderImageSrc,
		onClickInternalLink
	} from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { cart } from '../../../stores/cart/store';
	import Summary from './Summary.svelte';

	let mounted: boolean = false;
	onMount(() => (mounted = true));

	const onClickThumbnail = (e: MouseEvent, video: Video): void => {
		if (e.shiftKey || e.metaKey || e.ctrlKey || e.button === 1) return;

		e.preventDefault();

		const { href: videoUrl } = e.currentTarget as HTMLAnchorElement;

		pushState(videoUrl, { selectedVideo: video });
	};

	const onRemove = cart.remove;
</script>

<section>
	{#if mounted && $cart.length === 0}
		<div class="empty-cart">
			{getTranslation('cart.empty')}
			<br />
			<br />
			<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/">
				<Button variant="raised">
					<Label>{getTranslation('cart.browseVideos')}</Label>
				</Button>
			</a>
		</div>
	{/if}

	{#if mounted && $cart.length > 0}
		<div class="cart">
			{#each $cart as video (video.uuid)}
				<article class="cart-item-container">
					<a
						data-sveltekit-preload-data="false"
						href={`/videos/${video.uuid}`}
						onclick={(e) => onClickThumbnail(e, video)}
						onauxclick={(e) => onClickThumbnail(e, video)}
					>
						<img
							src={video.thumbnailFilePaths.length > 0
								? getImageSrc(video.thumbnailFilePaths[0], true)
								: getPlaceholderImageSrc()}
							alt={video.title}
						/>
					</a>
					<div class="video-details">
						<span class="video-title" title={video.title}>{video.title}</span>
						<span class="video-duration">
							{getTranslation('cart.videoDuration')}: {getDurationString(video.durationInSeconds)}
						</span>
						<span class="video-price">{getFormattedPrice(video.price)}</span>
						<button class="remove-from-cart" onclick={() => onRemove(video)}>
							{getTranslation('cart.remove')}
						</button>
					</div>
				</article>
			{/each}
		</div>
		<Summary />
	{/if}
</section>

<style>
	section {
		height: calc(100% - var(--navbar-height) + 10px);
		color: black;
		padding: 20px 35px;
		overflow-y: auto;

		background: linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(0, 60, 255) 1050%);
	}
	.empty-cart {
		text-align: center;
		margin-top: 50px;
		font-size: 40px;
		font-weight: bold;
	}
	.cart-item-container {
		margin-bottom: 20px;
		display: grid;
		grid-template-columns: 50% 50%;
	}

	.video-details {
		padding: 10px 15px;
		vertical-align: top;
		display: inline-block;
	}

	.video-duration {
		margin-top: 5px;
		display: block;
		font-size: 15px;
	}

	.cart-item-container img {
		box-shadow: 0px 0px 3px 1px grey;
		width: 100%;
		height: 150px;
		border-radius: 15px;
	}

	.video-title {
		font-weight: bold;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		font-size: 20px;
	}
	.video-price {
		display: block;
		text-shadow: 0px 0px 1px rgb(98, 224, 14);
		color: #333;
		font-weight: bold;
	}
	.remove-from-cart {
		font-size: 13px;
		color: rgba(131, 0, 0, 0.712);
		cursor: pointer;
		margin-top: 10px;
		display: inline-block;
		text-align: left;
	}
	.remove-from-cart:hover {
		color: rgb(158, 33, 33);
		text-decoration: underline;
	}
	@media (max-width: 600px) {
		.video-details {
			padding-left: 15px;
			width: 100%;
			padding-top: 10px;
		}
		.video-price {
			margin-top: 10px;
			font-size: 35px;
		}
		.remove-from-cart {
			width: 100%;
			margin-bottom: 20px;
		}
		.cart-item-container {
			grid-template-columns: 100%;
		}
	}
	@media (min-width: 600px) {
		.video-title {
			-webkit-line-clamp: 1;
			line-clamp: 1;
			overflow: hidden;
		}
		.video-price {
			margin-top: 20px;
			font-size: 25px;
		}
	}
	@media (min-width: 1000px) {
		.cart-item-container {
			grid-template-columns: 30% 70%;
		}
	}
</style>
