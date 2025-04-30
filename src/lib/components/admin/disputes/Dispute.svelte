<script lang="ts">
	import type { Dispute } from '$lib/models/Dispute';
	import { user } from '$lib/stores/user/store';
	import Claims from './Claims.svelte';
	import Details from './Details.svelte';

	let { dispute }: { dispute: Dispute } = $props();
</script>

<!-- todo: translations-->

<section>
	<Details {dispute} />
	<Claims {dispute} />

	{#if user.isAdmin() || dispute.invoice.buyerUuid === $user.data!.uuid}
		<button>Resolve dispute (TODO)</button>
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}
</style>
