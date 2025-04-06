<script lang="ts">
	import { onMount } from 'svelte';
	import { loading } from '../stores/loading/store';

	onMount(() => loading.set(false));
</script>

<section>An error occurred</section>

<style>
	section {
		width: 100%;
		padding-top: 200px;
		text-align: center;
		color: white;
		text-shadow: 1px 1px 10px black;
		border-color: 1px solid red;
		font-size: 35px;
	}
</style>
