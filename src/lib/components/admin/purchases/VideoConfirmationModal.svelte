<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { confirmVideo } from '$lib/services/payments';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import Button, { Label } from '@smui/button';
	import type { ApiError } from '../../../../errors/apiError';

	let {
		open = $bindable(false),
		paymentUUID,
		videoUUID,
		onConfirmCallback
	}: {
		open: boolean;
		paymentUUID: string;
		videoUUID: string;
		onConfirmCallback: (videoUUID: string) => void;
	} = $props();

	const onConfirm = async () => {
		if ($loading.value) {
			return;
		}
		try {
			loading.set(true);
			await confirmVideo(window.fetch, paymentUUID, videoUUID);
			toasts.success(getTranslation('purchases.details.confirmationModal.confirmationSuccess'));
			cacheInvalidation.refreshMyPurchases();
			onConfirmCallback(videoUUID);
		} catch (e: unknown) {
			const apiError = e as ApiError;
			if (!e || !(e as ApiError).getCode) {
				toasts.error(getTranslation('common.errors.generic'));
			} else {
				switch (apiError.getCode()) {
					case 409:
						toasts.warning(
							getTranslation('purchases.details.confirmationModal.confirmationDisputeConflict'),
							{
								duration: 15000
							}
						);
						break;
					default:
						toasts.error(getTranslation('common.errors.generic'));
				}
			}
		} finally {
			loading.set(false);
			open = false;
		}
	};
	const onCancel = () => {
		open = false;
	};
</script>

{#if open}
	<div class="modal-backdrop">
		<div class="modal-content">
			<h2>{getTranslation('purchases.details.confirmationModal.title')}</h2>
			<p class="message">{getTranslation('purchases.details.confirmationModal.message')}</p>
			<p class="auto-confirmation">
				{getTranslation('purchases.details.confirmationModal.autoConfirmation')}
			</p>
			<div class="actions">
				<Button variant="outlined" color="secondary" onclick={onCancel}>
					<Label>{getTranslation('purchases.details.confirmationModal.cancel')}</Label>
				</Button>
				<Button variant="raised" color="primary" onclick={onConfirm}>
					<Label>{getTranslation('purchases.details.confirmationModal.confirm')}</Label>
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

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		color: #333;
	}

	.message {
		margin: 0 0 1.5rem 0;
		line-height: 1.5;
		color: #555;
	}

	.auto-confirmation {
		margin: 0 0 1.5rem 0;
		font-size: 0.9rem;
		color: #666;
		font-style: italic;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
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
