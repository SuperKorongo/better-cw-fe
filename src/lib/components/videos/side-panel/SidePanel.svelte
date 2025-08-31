<script lang="ts">
	import { isMobileScreen } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	let aside: HTMLElement;
	let isVisible: boolean = $state<boolean>(true);

	onMount(() => {
		function setFiltersPositioning() {
			if (isMobileScreen()) return;

			if (window.scrollY <= 500) {
				aside.style.position = 'relative';
				aside.style.left = 'auto';
				aside.style.top = 'auto';
				aside.style.width = 'auto';
				aside.style.zIndex = '0';
				return;
			}

			aside.style.position = 'fixed';
			aside.style.left = '20px';
			aside.style.top = '80px';
			aside.style.zIndex = '100';
			aside.style.width = '18%';
		}
		setFiltersPositioning();
		setTimeout(() => {
			window.onscroll = setFiltersPositioning;
		}, 500);
	});

	/**
	 * Todo: for mobile screens, hide filters by default. Show a contaner displaying "filters" with a + button at the end to expand them.
	 * Once expanded, show a - to retract them.
	 * This behaviour only applies for mobile.
	 */
</script>

<aside bind:this={aside}>
	{#if isVisible}
		<button>-</button>
	{:else}
		<button>+</button>
	{/if}
	Search term <br />
	Order by <br />
	Price range <br />
	Public only / private only / all (all marked by default)<br />
	Duration (short/medium/long/any) (any marked by default) (1s to 2m, 2m to 20m, 15m to infinite)
	<br />
	Popular models <br />
	model 1, model 2, blablabla<br />
	model 4, etc<br />
	Popular tags
</aside>

<style>
	aside {
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		padding: 20px;
		border-radius: 20px;
		margin-bottom: 35px;
	}
</style>
