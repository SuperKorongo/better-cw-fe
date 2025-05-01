<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Dispute } from '$lib/models/Dispute';
	import { addClaimToDispute } from '$lib/services/admin/disputes';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDateWithTime } from '$lib/utils/utils';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';

	let { dispute }: { dispute: Dispute } = $props();

	const MAX_CLAIM_LENGTH: number = 500;
	let newClaim: string = $state('');

	const onAddComment = async (): Promise<void> => {
		if (newClaim.length < 10) {
			toasts.warning(getTranslation('purchases.details.disputeModal.minClaimLength'));
			return;
		}

		try {
			loading.set(true);
			await addClaimToDispute(window.fetch, dispute.uuid, newClaim);
			dispute.claims.unshift({
				author: user.isAdmin()
					? 'admin'
					: $user.data!.uuid === dispute.invoice.buyerUuid
						? 'buyer'
						: 'seller',
				addedAtTimestamp: new Date().getTime() / 1000,
				contents: newClaim
			});
			newClaim = '';

			window.scrollTo(0, 0);
			toasts.success(getTranslation('disputes.successfullyAdded'));
			cacheInvalidation.refreshMyDisputes();
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
		} finally {
			loading.set(false);
		}
	};
</script>

<div class="shadow-box">
	{#each dispute.claims as claim, index (index)}
		<div class="claim">
			<span class="author-and-date">
				{claim.author} | {getFormattedDateWithTime(claim.addedAtTimestamp)}
			</span>
			<span>{claim.contents}</span>
		</div>
	{/each}
</div>
<div class="shadow-box">
	<Textfield
		variant="outlined"
		textarea
		invalid={newClaim.length > MAX_CLAIM_LENGTH}
		style="width: 100%"
		bind:value={newClaim}
		input$maxlength={MAX_CLAIM_LENGTH}
		input$rows={8}
	>
		{#snippet helper()}
			<CharacterCounter />
		{/snippet}
	</Textfield>
	<Button onclick={onAddComment} variant="raised" color="primary">
		<Label>{getTranslation('disputes.addComment')}</Label>
	</Button>
	<span class="min-seconds-between-comments-disclaimer">
		<Label>{getTranslation('disputes.minSeconds')}</Label>
	</span>
</div>

<style>
	.shadow-box {
		background: #fff;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 40px;
	}
	.claim {
		margin-bottom: 50px;
	}
	.author-and-date {
		display: block;
		margin-bottom: 10px;
	}
	.min-seconds-between-comments-disclaimer {
		display: block;
		margin-top: 10px;
		color: #888;
		font-size: 12px;
	}
</style>
