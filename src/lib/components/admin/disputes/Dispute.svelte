<script lang="ts">
	import type { Dispute } from '$lib/models/Dispute';
	import { user } from '$lib/stores/user/store';
	import Claims from './Claims.svelte';
	import Details from './Details.svelte';

	let { dispute }: { dispute: Dispute } = $props();
</script>

<section>
	<Details {dispute} />
	<Claims {dispute} />

	{#if $user.data!.role === 'ADMIN' || dispute.invoice.buyerUuid === $user.data!.uuid}
		<button>Resolve dispute</button>
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}
</style>
