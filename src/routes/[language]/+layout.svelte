<script lang="ts">
	import { page } from '$app/state';
	import LoadingBar from '$lib/components/common/LoadingBar.svelte';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import { cart } from '$lib/stores/cart/store';
	import { search } from '$lib/stores/search/store';
	import { onMount } from 'svelte';

	import { afterNavigate } from '$app/navigation';
	import { PUBLIC_DOMAIN } from '$env/static/public';
	import { onClose as closeMenu } from '$lib/components/menu/events';
	import Menu from '$lib/components/menu/Menu.svelte';
	import ToastsContainer from '$lib/components/toasts/ToastsContainer.svelte';
	import Video from '$lib/components/video/Video.svelte';
	import { initLoggedInUser } from '$lib/services/users';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { language } from '$lib/stores/language/store';
	import { menu } from '$lib/stores/menu/store';
	import { navigationHistory } from '$lib/stores/navigation/store';
	import { availableLanguages, getTranslation, type Language } from '$lib/translations';
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

	let mounted: boolean = $state(false);
	onMount(() => {
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
		navigationHistory.push(page.url.pathname);
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
	<title>{getTranslation('homepage.htmlTitle')}</title>
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
</style>
