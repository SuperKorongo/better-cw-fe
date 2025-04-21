<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import Button, { Label } from '@smui/button';

	let { open = $bindable(false) } = $props();
</script>

{#if open}
	<div
		role="none"
		tabindex="-1"
		onkeypress={() => null}
		class="modal-backdrop"
		onclick={() => (open = false)}
	>
		<div
			role="none"
			onkeypress={() => null}
			class="modal-content"
			onclick={(e) => e.stopPropagation()}
		>
			<h2>{getTranslation('purchases.table.status')}</h2>
			<div class="status-list">
				<div class="status-row">
					<span class="status-label awaiting"
						>{getTranslation('purchases.status.awaitingBlockchain')}</span
					>
					<span class="status-description"
						>{getTranslation('purchases.status.descriptions.awaitingBlockchain')}</span
					>
				</div>
				<div class="status-row">
					<span class="status-label awaiting"
						>{getTranslation('purchases.status.awaitingConfirmation')}</span
					>
					<span class="status-description"
						>{getTranslation('purchases.status.descriptions.awaitingConfirmation')}</span
					>
				</div>
				<div class="status-row">
					<span class="status-label awaiting"
						>{getTranslation('purchases.status.awaitingFullFunds')}</span
					>
					<span class="status-description"
						>{getTranslation('purchases.status.descriptions.awaitingFullFunds')}</span
					>
				</div>
				<div class="status-row">
					<span class="status-label confirmed">{getTranslation('purchases.status.confirmed')}</span>
					<span class="status-description"
						>{getTranslation('purchases.status.descriptions.confirmed')}</span
					>
				</div>
				<div class="status-row">
					<span class="status-label expired">{getTranslation('purchases.status.expired')}</span>
					<span class="status-description"
						>{getTranslation('purchases.status.descriptions.expired')}</span
					>
				</div>
			</div>
			<div class="actions">
				<Button variant="outlined" color="secondary" onclick={() => (open = false)}>
					<Label>{getTranslation('common.close')}</Label>
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
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		color: #333;
	}

	.status-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.status-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.status-label {
		font-weight: 500;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.9rem;
		display: inline-block;
		width: fit-content;
	}

	.status-description {
		color: #666;
		font-size: 0.9rem;
		line-height: 1.4;
		margin-left: 0.5rem;
	}

	.status-label.awaiting {
		background-color: #fff3cd;
		color: #856404;
	}

	.status-label.confirmed {
		background-color: #d4edda;
		color: #155724;
	}

	.status-label.expired {
		background-color: #f8d7da;
		color: #721c24;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	@media (max-width: 599px) {
		.modal-content {
			width: 95%;
			padding: 1.5rem;
		}
	}
</style>
