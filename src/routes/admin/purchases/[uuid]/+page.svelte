<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Payment } from '$lib/models/Payment';
	import { getPaymentByUUID } from '$lib/services/payments';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';
	import PaymentDetails from '$lib/components/admin/purchases/PaymentDetails.svelte';
	import PurchasedVideos from '$lib/components/admin/purchases/PurchasedVideos.svelte';

	let payment: Payment | null = $state(null);

	onMount(async () => {
		const { uuid } = $page.params;

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
		<div class="payment-details">
			<h1>{getTranslation('purchases.title')}</h1>
			<PaymentDetails {payment} />
			<PurchasedVideos {payment} />
			<div class="actions">
				<Button variant="raised" style="margin-right: 1rem;">
					<Label>{getTranslation('purchases.details.confirmPurchase')}</Label>
				</Button>
				<Button variant="outlined" class="dispute-button">
					<Label>{getTranslation('purchases.details.openDispute')}</Label>
				</Button>
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}

	h1 {
		margin-bottom: 2rem;
		font-size: 1.5rem;
		color: #333;
	}

	.payment-details {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	@media (max-width: 599px) {
		section {
			padding: 1rem;
		}

		.actions {
			flex-direction: column;
		}
	}
</style>
