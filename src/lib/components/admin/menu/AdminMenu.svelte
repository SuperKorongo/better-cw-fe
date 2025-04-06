<script lang="ts">
	import { page } from '$app/state';
	import CloseButton from '$lib/components/menu/CloseButton.svelte';
	import { adminMenu } from '$lib/stores/menu/store';
	import { getTranslation } from '$lib/translations';
	import { isMobileScreen, onClickInternalLink } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { swipe } from 'svelte-gestures';
	import { onClose, onSwipe } from './events';

	let menuContainer: HTMLElement;

	onMount(() => {
		adminMenu.setContainer(menuContainer);
	});

	const onClickMenuLink = (e: MouseEvent): void => {
		if (isMobileScreen()) {
			onClose();
		}
		onClickInternalLink(e);
	};

	const getClass = (href: string): string => {
		if (page.route.id && page.route.id.includes(href)) {
			return 'active';
		}
		return '';
	};

	const menu = [
		{
			href: '/admin/profile',
			label: getTranslation('admin.menu.profile')
		},
		{
			href: '/admin/my-videos',
			label: getTranslation('admin.menu.myVideos')
		},
		{
			href: '/admin/disputes',
			label: getTranslation('admin.menu.disputes')
		},
		{
			href: '/admin/purchases',
			label: getTranslation('admin.menu.purchases')
		},
		{
			href: '/admin/withdraw',
			label: getTranslation('admin.menu.withdraw')
		}
	];
</script>

<aside
	use:swipe={() => ({ timeframe: 300, minSwipeDistance: 100, touchAction: 'pan-y' })}
	onswipe={onSwipe}
	bind:this={menuContainer}
>
	<main>
		{#if isMobileScreen()}
			<CloseButton onClick={onClose} />
		{/if}
		<section class="main-section">
			{#each menu as item (item.href)}
				<div class={getClass(item.href)}>
					<a onclick={onClickMenuLink} data-sveltekit-preload-data="tap" href={item.href}>
						{item.label}
					</a>
				</div>
			{/each}
		</section>
	</main>
</aside>

<style>
	aside {
		top: var(--navbar-height);
		z-index: 2;
		position: fixed;
		height: calc(100% - var(--navbar-height));
		background: linear-gradient(180deg, #010c2f 0%, #010c2f 47%, rgb(0, 0, 0) 100%);

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

	.main-section > div.active {
		background-color: blue;
		padding: 10px 20px;
		border-radius: 10px;
	}

	@keyframes expand-left-to-right {
		0% {
			left: -400px;
		}
		100% {
			left: 0%;
		}
	}
	@keyframes hide-right-to-left {
		0% {
			left: 0%;
		}
		100% {
			left: -420px;
		}
	}
	@keyframes expand-left-to-right-100 {
		0% {
			left: -100%;
		}
		100% {
			left: 0%;
		}
	}
	@keyframes hide-right-to-left-100 {
		0% {
			left: 0%;
		}
		100% {
			left: -104%;
		}
	}

	@media (max-width: 900px) {
		aside {
			width: 100%;
			animation-name: expand-left-to-right-100;
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
			animation-name: expand-left-to-right;
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
