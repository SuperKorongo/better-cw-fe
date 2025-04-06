<script lang="ts">
	import { cart } from '$lib/stores/cart/store';
	import { menu } from '$lib/stores/menu/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { onClickInternalLink } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { swipe } from 'svelte-gestures';
	import GlowingText from '../common/GlowingText.svelte';
	import CartIcon from '../icons/CartIcon.svelte';
	import ContactIcon from '../icons/ContactIcon.svelte';
	import DollarSignIcon from '../icons/DollarSignIcon.svelte';
	import HomeIcon from '../icons/HomeIcon.svelte';
	import InfoIcon from '../icons/InfoIcon.svelte';
	import PriceTagIcon from '../icons/PriceTagIcon.svelte';
	import ProfileIcon from '../icons/ProfileIcon.svelte';
	import CloseButton from './CloseButton.svelte';
	import Languages from './Languages.svelte';
	import UserSection from './UserSection.svelte';
	import { onClose, onSwipe } from './events';

	let menuContainer: HTMLElement;

	onMount(() => {
		menu.setContainer(menuContainer);
	});
</script>

<aside
	use:swipe={() => ({ timeframe: 300, minSwipeDistance: 100, touchAction: 'pan-y' })}
	onswipe={onSwipe}
	bind:this={menuContainer}
>
	<main>
		<Languages />
		<CloseButton onClick={onClose} />
		<section class="main-section">
			<div>
				<div>
					<HomeIcon />
				</div>
				<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/">
					{getTranslation('menu.home')}
				</a>
			</div>
			<div>
				<div>
					<CartIcon />
				</div>
				<div>
					<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/cart">
						{getTranslation('menu.cart')}
					</a>
					{#key $cart}
						{#if $cart.length > 0}
							<span class="cart-items">{$cart.length}</span>
						{/if}
					{/key}
				</div>
			</div>
			{#if $user.data !== null}
				<div>
					<div>
						<ProfileIcon />
					</div>
					<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/admin/profile">
						{getTranslation('menu.profile')}
					</a>
				</div>
				<div>
					<div>
						<PriceTagIcon />
					</div>
					<a
						onclick={onClickInternalLink}
						data-sveltekit-preload-data="tap"
						href="/admin/purchases"
					>
						{getTranslation('menu.purchases')}
					</a>
				</div>
			{/if}
			<div>
				<div>
					<InfoIcon />
				</div>
				<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/about-us">
					{getTranslation('menu.aboutUs')}
				</a>
			</div>
			<div>
				<div>
					<ContactIcon />
				</div>
				<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/contact-us">
					{getTranslation('menu.contactUs')}
				</a>
			</div>
			<div>
				<div>
					<DollarSignIcon />
				</div>
				<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/upload">
					<GlowingText text={getTranslation('menu.uploadVideos')} />
				</a>
			</div>
			<UserSection />
		</section>
	</main>
</aside>

<style>
	aside {
		top: 0%;
		z-index: 10;
		box-shadow: 0px 0px 25px 20px black;
		position: fixed;
		height: 100%;
		background: linear-gradient(180deg, rgb(32, 0, 255) 0%, rgb(0, 25, 125) 47%, rgb(0, 0, 0) 100%);

		animation-duration: 0.3s;
		animation-fill-mode: forwards;

		overflow-y: scroll;
		overflow-x: hidden;
	}

	.main-section {
		font-weight: bold;
		padding: 0 50px;
	}
	.main-section > div {
		display: flex;
		align-items: center;
	}
	.main-section > div a {
		margin-left: 15px;
	}

	.cart-items {
		border-radius: 50%;
		font-size: 10px;
		padding: 2px 5px;
		font-weight: bold;
		text-shadow: 1px 1px 2px black;
		background: red;
		position: absolute;
		margin-left: 5px;
	}

	@keyframes expand-right-to-left {
		0% {
			right: -400px;
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
			right: -420px;
		}
	}
	@keyframes expand-right-to-left-100 {
		0% {
			right: -100%;
		}
		100% {
			right: 0%;
		}
	}
	@keyframes hide-left-to-right-100 {
		0% {
			right: 0%;
		}
		100% {
			right: -104%;
		}
	}

	@media (max-width: 900px) {
		aside {
			width: 100%;
			animation-name: expand-right-to-left-100;
		}
		.main-section {
			margin-top: 40px;
			font-size: 18px;
		}
		.main-section > div {
			margin-bottom: 30px;
		}
	}
	@media (min-width: 900px) {
		aside {
			width: 400px;
			animation-name: expand-right-to-left;
		}
		.main-section {
			margin-top: 80px;
			font-size: 23px;
		}
		.main-section > div {
			margin-bottom: 45px;
		}
	}
</style>
