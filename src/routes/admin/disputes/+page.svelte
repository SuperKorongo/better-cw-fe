<script lang="ts">
	import { loading } from '$lib/stores/loading/store';
	import { onMount } from 'svelte';

	onMount(() => loading.set(false));
</script>

<section>Disputes</section>

<style>
</style>
