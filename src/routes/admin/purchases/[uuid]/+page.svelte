<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Payment } from '$lib/models/Payment';
	import { getPaymentByUUID } from '$lib/services/payments';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { onMount } from 'svelte';

	let payment: Payment | null = $state(null);

	onMount(async () => {
		const { uuid } = page.params as { uuid: string };

		try {
			payment = await getPaymentByUUID(window.fetch, uuid);
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
			goto('/admin/purchases');
		} finally {
			loading.set(false);
		}
	});
</script>

<section>
	{#if payment}
		<pre>{JSON.stringify(payment, null, 4)}</pre>
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}

	pre {
		background-color: #f5f5f5;
		padding: 20px;
		border-radius: 8px;
		overflow-x: auto;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	@media (max-width: 599px) {
		section {
			padding: 20px;
		}
	}
</style>
