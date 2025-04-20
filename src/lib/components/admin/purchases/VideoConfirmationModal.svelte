<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import Button, { Label } from '@smui/button';

	let { open = $bindable(false), videoTitle = '' } = $props();
</script>

{#if open}
	<div class="modal-backdrop">
		<div class="modal-content">
			<h2>{getTranslation('purchases.details.confirmationModal.title')}</h2>
			<p class="message">{getTranslation('purchases.details.confirmationModal.message')}</p>
			<div class="actions">
				<Button variant="outlined" color="secondary" onclick={() => (open = false)}>
					<Label>{getTranslation('purchases.details.confirmationModal.cancel')}</Label>
				</Button>
				<Button variant="raised" color="primary" onclick={() => (open = false)}>
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

		:global(.actions button) {
			width: 100%;
		}
	}
</style>
