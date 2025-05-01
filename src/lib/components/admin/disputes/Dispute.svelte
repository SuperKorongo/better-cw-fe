<script lang="ts">
	import {
		BUYER_IS_RIGHT_RESOLUTION,
		OPEN_DISPUTE_STATUS,
		SELLER_IS_RIGHT_RESOLUTION,
		type Dispute
	} from '$lib/models/Dispute';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import Button from '@smui/button';
	import Claims from './Claims.svelte';
	import Details from './Details.svelte';
	import ResolveDisputeConfirmModal from './ResolveDisputeConfirmModal.svelte';

	let { dispute }: { dispute: Dispute } = $props();

	let isConfirmationModalOpen: boolean = $state(false);
	let resolution: number = $state(0);

	const onClickResolveDispute = (_resolution: number) => {
		isConfirmationModalOpen = true;
		resolution = _resolution;
	};
</script>

<section>
	<Details {dispute} />
	<Claims {dispute} />

	{#if dispute.status === OPEN_DISPUTE_STATUS}
		{#if user.isAdmin() || dispute.invoice.buyerUuid === $user.data!.uuid}
			<Button
				onclick={() => {
					onClickResolveDispute(SELLER_IS_RIGHT_RESOLUTION);
				}}
				variant="raised"
				color="secondary"
			>
				{getTranslation('disputes.resolve')}
			</Button>
		{/if}
		{#if user.isAdmin()}
			<Button
				onclick={() => {
					onClickResolveDispute(BUYER_IS_RIGHT_RESOLUTION);
				}}
				color="secondary">{getTranslation('disputes.adminResolve')}</Button
			>
		{/if}
	{/if}
</section>

<ResolveDisputeConfirmModal bind:open={isConfirmationModalOpen} {resolution} {dispute} />

<style>
	section {
		padding: 30px 50px;
	}
</style>
