<script lang="ts">
	import Rating from '$lib/components/admin/purchases/Rating.svelte';
	import GlowingText from '$lib/components/common/GlowingText.svelte';
	import type { Video } from '$lib/models/Video';
	import { cart } from '$lib/stores/cart/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { getFormattedPrice, getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';
	import Button, { Label } from '@smui/button';

	let {
		video
	}: {
		video: Video;
	} = $props();

	const onClick = () => cart.add(video);
	const isInCart = () => $cart.find((v) => video.uuid === v.uuid);
</script>

<span class="price">
	<GlowingText text={getFormattedPrice(video.price)} />
</span>

{#key $cart}
	{#if video.price.value}
		{#if isInCart()}
			<span class="video-in-cart-info">{getTranslation('video.alreadyInCart')}✅</span>
			<a
				onclick={onClickInternalLink}
				class="go-to-cart-button"
				data-sveltekit-preload-data="tap"
				href={getHrefWithLanguage(`/cart`)}
			>
				<Button variant="raised" color="secondary">
					<Label>{getTranslation('video.gotoCart')}</Label>
				</Button>
			</a>
		{:else}
			<div class="add-to-cart-container">
				<Button onclick={onClick} variant="raised">
					<Label>{getTranslation('video.addToCart')}</Label>
				</Button>
			</div>
		{/if}
	{:else}
		<div>
			{#if video.downloadLink && $user.data !== null}
				<Rating videoUUID={video.uuid} />
			{/if}
		</div>
	{/if}
{/key}

<style>
	.price {
		font-size: 50px;
		color: rgb(255, 255, 255);
		font-weight: bold;
		display: block;
		margin-bottom: 15px;
		text-wrap: nowrap;
		font-variant: small-caps;
	}
	.video-in-cart-info {
		font-weight: bold;
		text-shadow: 1px 1px 2px black;
		font-size: 14px;
		letter-spacing: 2px;
		display: block;
		text-wrap: nowrap;
		font-variant: small-caps;
		line-height: 10px;
		margin-bottom: 10px;
	}
	.go-to-cart-button {
		margin-bottom: -10px;
		display: inline-block;
	}
	.add-to-cart-container {
		text-wrap: nowrap;
	}
</style>
