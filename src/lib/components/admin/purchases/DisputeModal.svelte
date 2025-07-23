<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { openDispute } from '$lib/services/admin/disputes';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { handleApiError } from '$lib/utils/utils';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
	import { SvelteMap } from 'svelte/reactivity';

	let {
		open = $bindable(false),
		paymentUUID,
		videoUUID,
		onDisputeOpenCallback
	}: {
		open: boolean;
		paymentUUID: string;
		videoUUID: string;
		onDisputeOpenCallback: (e: MouseEvent, videoUUID: string, disputeUUID: string) => void;
	} = $props();

	const MAX_CLAIM_LENGTH: number = 500;
	let claim: string = $state('');

	const onCancel = (): void => {
		open = false;
	};

	const onOpenDispute = async (e: MouseEvent): Promise<void> => {
		if (claim.length < 10) {
			toasts.warning(getTranslation('purchases.details.disputeModal.minClaimLength'));
			return;
		}

		try {
			loading.set(true);
			const dispute = await openDispute(window.fetch, paymentUUID, videoUUID, claim);
			toasts.success(getTranslation('purchases.details.disputeModal.successfullyOpened'), {
				duration: 15000
			});
			cacheInvalidation.refreshMyDisputes();
			onDisputeOpenCallback(e, videoUUID, dispute.uuid);
		} catch (e: unknown) {
			const funcMap = new SvelteMap<number, () => void>();
			funcMap.set(409, () => {
				toasts.warning(getTranslation('purchases.details.disputeModal.conflict'), {
					duration: 15000
				});
			});
			handleApiError(e, 'common.errors.generic', funcMap);
		} finally {
			loading.set(false);
			open = false;
		}
	};
</script>

{#if open}
	<div class="modal-backdrop">
		<div class="modal-content">
			<h2>{getTranslation('purchases.details.disputeModal.open')}⚠️</h2>
			<div>
				{getTranslation('purchases.details.disputeModal.text')}
				<br /><br />
				{getTranslation('purchases.details.disputeModal.text2')}
			</div>
			<div class="textarea-container">
				<Textfield
					variant="outlined"
					textarea
					invalid={claim.length > MAX_CLAIM_LENGTH}
					style="width: 100%"
					bind:value={claim}
					input$maxlength={MAX_CLAIM_LENGTH}
					input$rows={8}
				>
					{#snippet helper()}
						<CharacterCounter />
					{/snippet}
				</Textfield>
			</div>
			<div class="actions">
				<Button variant="outlined" color="secondary" onclick={onCancel}>
					<Label>{getTranslation('purchases.details.confirmationModal.cancel')}</Label>
				</Button>
				<Button variant="raised" color="primary" onclick={onOpenDispute}>
					<Label>{getTranslation('purchases.details.disputeModal.open')}</Label>
				</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		max-width: 500px;
		width: 90%;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.textarea-container {
		margin: 20px 0px;
	}

	@media (max-width: 599px) {
		.modal-content {
			width: 95%;
			padding: 1.5rem;
		}

		.actions {
			flex-direction: column-reverse;
		}
	}
</style>
