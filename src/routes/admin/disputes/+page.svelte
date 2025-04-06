<script lang="ts">
	import { onMount } from 'svelte';
	import { loading } from '../../../stores/loading/store';

	onMount(() => loading.set(false));
</script>

<section>Disputes</section>

<style>
</style>
