<script lang="ts">
	import { isMobileScreen } from '$lib/utils/utils';

	import { page } from '$app/state';
	import ExpandablePanel from './ExpandablePanel.svelte';
	import Filters from './Filters.svelte';
	import PopuplarTags from './PopuplarTags.svelte';

	let aside: HTMLElement | null = $state(null);

	$effect(() => {
		if (aside === null) {
			return;
		}

		window.scrollTo(0, 1);
		setFiltersPositioning(aside);

		(function (el: HTMLElement) {
			setTimeout(() => {
				window.onscroll = () => setFiltersPositioning(el!);
			}, 500);
		})(aside);

		function setFiltersPositioning(element: HTMLElement) {
			if (isMobileScreen()) return;

			const cutOffPxByPage: { [key: string]: number } = {
				'/[language]': 500,
				'/[language]/users/[name]': 120,
				'/[language]/tags/[name]': 120,
				'/[language]/models/[name]': 120
			};

			if (window.scrollY <= cutOffPxByPage[page.route.id as string]) {
				element.style.position = 'relative';
				element.style.left = 'auto';
				element.style.top = 'auto';
				element.style.width = 'auto';
				element.style.zIndex = '0';
				return;
			}

			element.style.position = 'fixed';
			element.style.left = '20px';
			element.style.top = '80px';
			element.style.zIndex = '100';
			element.style.width = '20%';
		}
	});
</script>

<aside bind:this={aside}>
	<ExpandablePanel title={'Filters // todo: translate'}>
		{#snippet component()}
			<Filters />
		{/snippet}
	</ExpandablePanel>

	<ExpandablePanel title={'Popular tags // todo: translate'}>
		{#snippet component()}
			<PopuplarTags />
		{/snippet}
	</ExpandablePanel>
</aside>

<style>
</style>
