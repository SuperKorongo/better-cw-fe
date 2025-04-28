<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Dispute from '$lib/components/admin/disputes/Dispute.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Dispute as DisputeType } from '$lib/models/Dispute';
	import { getDisputeByUUID } from '$lib/services/admin/disputes';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { onMount } from 'svelte';

	let dispute: DisputeType | null = $state(null);

	onMount(async () => {
		const { uuid } = page.params;

		try {
			dispute = await getDisputeByUUID(window.fetch, uuid);
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
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
</style>
