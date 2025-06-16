<script lang="ts">
	import { PUBLIC_AD_BANNER_KEY, PUBLIC_AD_BANNER_SRC } from '$env/static/public';
	import { isAdblockPresent } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	let height: number = 250;
	let width: number = 300;

	let container: HTMLDivElement | null = $state(null);
	let _isAdBlockPresent: boolean = $state(true);

	onMount(async () => {
		_isAdBlockPresent = await isAdblockPresent();
		if (_isAdBlockPresent) {
			return;
		}
	});

	$effect(() => {
		if (!container || _isAdBlockPresent) {
			return;
		}

		(
			window as unknown as {
				atOptions: { [key: string]: string | number | object };
			}
		).atOptions = {
			key: PUBLIC_AD_BANNER_KEY,
			format: 'iframe',
			height,
			width,
			params: {}
		};

		const scriptNode = document.createElement('script');
		scriptNode.setAttribute('type', 'text/javascript');
		scriptNode.setAttribute('src', PUBLIC_AD_BANNER_SRC);

		container.append(scriptNode); // eslint-disable-line svelte/no-dom-manipulating
	});
</script>

{#if !_isAdBlockPresent && PUBLIC_AD_BANNER_KEY}
	<div bind:this={container}></div>
{/if}

<style>
	div {
		padding-left: 10px;
		max-width: 400px;
		max-height: 200px;
	}
</style>
