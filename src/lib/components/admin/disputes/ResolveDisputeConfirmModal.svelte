<script lang="ts">
	import { goto } from '$app/navigation';
	import * as toasts from '$lib/components/toasts/toasts';
	import { SELLER_IS_RIGHT_RESOLUTION, type Dispute } from '$lib/models/Dispute';
	import { closeDispute } from '$lib/services/admin/disputes';
	import { initLoggedInUser } from '$lib/services/users';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { handleApiError } from '$lib/utils/utils';
	import Button, { Label } from '@smui/button';

	let {
		open = $bindable(false),
		dispute,
		resolution
	}: {
		open: boolean;
		dispute: Dispute;
		resolution: number;
	} = $props();

	const onCancel = (): void => {
		open = false;
	};

	const onConfirm = async (): Promise<void> => {
		if ($loading.value) {
			return;
		}
		try {
			loading.set(true);
			await closeDispute(window.fetch, dispute.uuid, resolution);
			cacheInvalidation.refreshMyDisputes();
			toasts.success(getTranslation('disputes.successfullyResolved'));
			open = false;
			goto('/admin/disputes');
			cacheInvalidation.refreshMe();
			initLoggedInUser();
		} catch (e: unknown) {
			handleApiError(e);
		} finally {
			loading.set(false);
		}
	};
</script>

{#if open}
	<div class="modal-backdrop">
		<div class="modal-content">
			<h2>{getTranslation('disputes.confirmationModal.title')}</h2>
			{#if resolution === SELLER_IS_RIGHT_RESOLUTION}
				<div class="disclaimer">
					<span>{getTranslation('disputes.confirmationModal.disclaimer1')}</span>
					<span>{getTranslation('disputes.confirmationModal.disclaimer2')}</span>
				</div>
			{/if}
			<div class="actions">
				<Button variant="outlined" color="secondary" onclick={onCancel}>
					<Label>{getTranslation('disputes.confirmationModal.cancel')}</Label>
				</Button>
				<Button variant="raised" color="primary" onclick={onConfirm}>
					<Label>{getTranslation('disputes.confirmationModal.resolve')}</Label>
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

	.disclaimer > span {
		display: block;
		margin-bottom: 20px;
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
