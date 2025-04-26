<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';

	let {
		open = $bindable(false),
		paymentUUID,
		videoUUID,
		onDisputeOpenCallback
	}: {
		open: boolean;
		paymentUUID: string;
		videoUUID: string;
		onDisputeOpenCallback: (videoUUID: string) => void;
	} = $props();

	const MAX_CLAIM_LENGTH: number = 500;
	let claim: string = $state('');

	const onCancel = (): void => {
		open = false;
	};

	const onOpenDispute = (): void => {
		console.log(claim);
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
