<script lang="ts">
	import { page } from '$app/state';
	import CloseButton from '$lib/components/menu/CloseButton.svelte';
	import { language } from '$lib/stores/language/store';
	import { adminMenu } from '$lib/stores/menu/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { getHrefWithLanguage, isMobileScreen, onClickInternalLink } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { onClose } from './events';

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
		if (page.url.href.includes(href)) {
			return 'active';
		}
		return '';
	};

	const menu = [
		{
			href: getHrefWithLanguage(`/admin/profile`),
			label: getTranslation('admin.menu.profile')
		},
		{
			href: getHrefWithLanguage(`/admin/my-friends`),
			label: getTranslation('admin.menu.myFriends')
		},
		{
			href: getHrefWithLanguage(`/admin/my-videos`),
			label: getTranslation('admin.menu.myVideos')
		},
		{
			href: getHrefWithLanguage(`/admin/disputes`),
			label: getTranslation('admin.menu.disputes')
		},
		{
			href: getHrefWithLanguage(`/admin/purchases`),
			label: getTranslation('admin.menu.purchases')
		},
		{
			href: getHrefWithLanguage(`/admin/withdraw`),
			label: getTranslation('admin.menu.withdraw')
		}
	];
</script>

<aside bind:this={menuContainer}>
	<main>
		{#if isMobileScreen()}
			<CloseButton onClick={onClose} />
		{/if}
		<section class="main-section">
			{#each menu as item (item.href)}
				<div class={getClass(item.href)}>
					<a onclick={onClickMenuLink} data-sveltekit-preload-data="tap" href={item.href}>
						{item.label}
						{#if item.href === `/${$language}/admin/my-friends` && $user.data?.hasPendingFriendRequests}
							<span class="alert-indicator"></span>
						{/if}
						{#if item.href === `/${$language}/admin/disputes` && $user.data?.hasOpenDisputes}
							<span class="alert-indicator-2"></span>
						{/if}
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

		overflow-y: auto;
		overflow-x: hidden;
	}

	.main-section {
		font-weight: bold;
		padding: 0 50px;
	}

	.main-section > div {
		position: relative;
		display: flex;
		align-items: center;
	}

	.main-section > div.active {
		background-color: blue;
		padding: 10px 20px;
		border-radius: 10px;
	}

	.alert-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: red;
		position: absolute;
		margin-left: 5px;
	}

	.alert-indicator-2 {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: red;
		position: absolute;
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
		.alert-indicator-2 {
			margin-top: -20px;
			margin-left: 80px;
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
		.alert-indicator-2 {
			margin-top: -25px;
			margin-left: 102px;
		}
	}
</style>
