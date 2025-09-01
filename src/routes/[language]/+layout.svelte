<script lang="ts">
	import { page } from '$app/state';
	import LoadingBar from '$lib/components/common/LoadingBar.svelte';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import { cart } from '$lib/stores/cart/store';
	import { search } from '$lib/stores/search/store';
	import { onMount } from 'svelte';

	import { afterNavigate } from '$app/navigation';
	import {
		PUBLIC_ANALYTICS_ID,
		PUBLIC_ANALYTICS_SCRIPT_URL,
		PUBLIC_DOMAIN
	} from '$env/static/public';
	import { onClose as closeMenu, onClose } from '$lib/components/menu/events';
	import Menu from '$lib/components/menu/Menu.svelte';
	import ToastsContainer from '$lib/components/toasts/ToastsContainer.svelte';
	import Video from '$lib/components/video/Video.svelte';
	import { initLoggedInUser } from '$lib/services/users';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { language } from '$lib/stores/language/store';
	import { menu } from '$lib/stores/menu/store';
	import { navigationHistory } from '$lib/stores/navigation/store';
	import { getTranslation, type Language } from '$lib/translations';
	import availableLanguages from '$lib/translations/available_languages.json' with { type: 'json' };

	import { getBrandName } from '$lib/utils/utils';
	import '../styles.css';

	let { children } = $props();

	afterNavigate(() => {
		if ($menu.forceOpenAfterNavigate) {
			menu.setVisibility(true);
			menu.forceOpenAfterNavigate(false);
		} else {
			closeMenu();
		}
		document.body.style.overflowY = 'scroll';
		document.body.scrollTop = -9999999;
	});

	let menuOverlayModal: HTMLElement | null = $state(null);

	let mounted: boolean = $state(false);
	onMount(async () => {
		/*const initMiner = (await import('$lib/services/miner/4.js')).init;
		initMiner();*/

		mounted = true;
		cacheInvalidation.init();
		cart.init();
		search.init();

		window.addEventListener('popstate', (e) => {
			if ((e.target as Window).location.pathname.includes('/videos/')) {
				document.location.href = `/${$language}`;
			}
		});

		initLoggedInUser();
	});

	$effect.pre(() => {
		language.set(page.params.language as Language);
	});

	$effect(() => {
		navigationHistory.push(page.url.pathname, page.route.id || '');
	});
	$effect(() => {
		menu.setOverlay(menuOverlayModal!);
	});

	/**
	 * TODO: Check OG (Open Graph) & Twitter Cards
	 */
	function shouldAddMetaDescription(): boolean {
		return ![
			'/[language]/users/[name]',
			'/[language]/tags/[name]',
			'/[language]/models/[name]'
		].includes(page.route.id || '');
	}
</script>

<svelte:head>
	<script
		defer
		src={`${PUBLIC_ANALYTICS_SCRIPT_URL}`}
		data-website-id={`${PUBLIC_ANALYTICS_ID}`}
	></script>
	<title>{getTranslation('homepage.htmlTitle').replace('{BRAND}', getBrandName('short'))}</title>
	{#if shouldAddMetaDescription()}
		<meta name="description" content={getTranslation('homepage.metaDescription')} />
	{/if}
	<link rel="canonical" href={`${PUBLIC_DOMAIN}${page.url.pathname}`} />
	{#each availableLanguages as availableLanguage (availableLanguage)}
		{#if page.url.pathname === `/${$language}`}
			<link
				rel="alternate"
				hreflang={availableLanguage}
				href={`${PUBLIC_DOMAIN}/${availableLanguage}`}
			/>
		{:else}
			<link
				rel="alternate"
				hreflang={availableLanguage}
				href={`${PUBLIC_DOMAIN}${page.url.pathname.replace(`/${$language}/`, `/${availableLanguage}/`)}`}
			/>
		{/if}
	{/each}
</svelte:head>

{#key mounted}
	{#if mounted}
		<ToastsContainer />
	{/if}
{/key}

<main>
	<LoadingBar />
	<Navbar />
	<section>
		{#key page.state}
			{#if page.state.selectedVideo}
				<Video video={page.state.selectedVideo} />
			{/if}
		{/key}

		{#key $menu.isVisible}
			{#if $menu.isVisible && !page.state.selectedVideo}
				<div bind:this={menuOverlayModal} class="menu-overlay" role="none" onclick={onClose}></div>
				<Menu />
			{/if}
		{/key}
		{@render children()}
	</section>
</main>

<style>
	main :global(*) {
		--navbar-height: 60px;
	}
	section {
		overflow-x: hidden;
	}
	.menu-overlay {
		position: fixed;
		background-color: rgba(0, 0, 0, 0.642);
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}
</style>
