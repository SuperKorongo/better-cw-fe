<script lang="ts">
	import { loading } from '$lib/stores/loading/store';
	import { onMount } from 'svelte';

	onMount(() => loading.set(false));
</script>

<section>Withdraw</section>

<style>
</style>
