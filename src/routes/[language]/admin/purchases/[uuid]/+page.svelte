<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PaymentDetails from '$lib/components/admin/purchases/PaymentDetails.svelte';
	import PurchasedVideos from '$lib/components/admin/purchases/PurchasedVideos.svelte';
	import type { Payment } from '$lib/models/Payment';
	import { getPaymentByUUID } from '$lib/services/payments';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { language } from '$lib/stores/language/store';
	import { loading } from '$lib/stores/loading/store';
	import { goToInternalLink, handleApiError } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	let payment: Payment | null = $state(null);

	onMount(async () => {
		loadData();
	});

	$effect(() => {
		void $cacheInvalidation.myPurchases;
		loadData();
	});

	const loadData = async () => {
		const { uuid } = page.params;

		try {
			payment = await getPaymentByUUID(window.fetch, uuid);
		} catch (e: unknown) {
			handleApiError(e);
			goto(`${$language}/admin/purchases`);
		} finally {
			loading.set(false);
		}
	};

	const onConfirmVideoCallback = (videoUUID: string) => {
		const video = payment!.videos.find((video) => video.uuid === videoUUID);
		if (!video) return;

		video.confirmedAtTimestamp = new Date().getTime() / 1000;
	};

	const onDisputeOpenCallback = (e: MouseEvent, videoUUID: string, disputeUUID: string) => {
		goToInternalLink(e, `/admin/disputes/${disputeUUID}`);
	};
</script>

<section>
	{#if payment}
		<div class="payment-details">
			<PaymentDetails {payment} />
			<PurchasedVideos {payment} {onConfirmVideoCallback} {onDisputeOpenCallback} />
		</div>
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}

	.payment-details {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (max-width: 599px) {
		section {
			padding: 1rem;
		}
	}
</style>
