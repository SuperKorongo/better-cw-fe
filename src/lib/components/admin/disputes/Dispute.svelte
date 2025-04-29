<script lang="ts">
	import type { Dispute } from '$lib/models/Dispute';
	import Claims from './Claims.svelte';
	import Details from './Details.svelte';

	let { dispute }: { dispute: Dispute } = $props();
</script>

<section>
	<Details {dispute} />
	<Claims {dispute} />
	<button>Resolve dispute (button only visible to the buyer and admins)</button>
</section>

<style>
	section {
		padding: 30px 50px;
	}
</style>
