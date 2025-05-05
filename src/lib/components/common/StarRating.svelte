<script lang="ts">
	import { Rating, Star } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let {
		size = 25,
		totalStars = 5,
		value = 3.5
	}: {
		size?: number;
		totalStars?: number;
		value?: number;
	} = $props();

	let isMounted: boolean = $state(false);

	onMount(() => (isMounted = true));
</script>

{#if isMounted}
	<div class="container">
		<Rating icon={Star} total={totalStars} {size} rating={value} />
	</div>
{/if}

<style>
</style>
