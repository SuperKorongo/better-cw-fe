<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Dispute from '$lib/components/admin/disputes/Dispute.svelte';
	import type { Dispute as DisputeType } from '$lib/models/Dispute';
	import { getDisputeByUUID } from '$lib/services/admin/disputes';
	import { loading } from '$lib/stores/loading/store';
	import { handleApiError } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	let dispute: DisputeType | null = $state(null);

	onMount(async () => {
		const { uuid } = page.params;

		try {
			dispute = await getDisputeByUUID(window.fetch, uuid);
		} catch (e: unknown) {
			handleApiError(e);
			goto('/admin/disputes');
		} finally {
			loading.set(false);
		}
	});
</script>

<section>
	{#if dispute}
		<Dispute {dispute} />
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}
	@media (max-width: 599px) {
		section {
			padding: 1rem;
		}
	}
</style>
