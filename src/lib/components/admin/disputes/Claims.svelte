<script lang="ts">
	import type { Dispute } from '$lib/models/Dispute';
	import { getFormattedDateWithTime } from '$lib/utils/utils';

	let { dispute }: { dispute: Dispute } = $props();
</script>

<!-- todo: translations-->

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
</style>
