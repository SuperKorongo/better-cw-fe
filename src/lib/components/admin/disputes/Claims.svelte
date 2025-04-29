<script lang="ts">
	import type { Dispute } from '$lib/models/Dispute';

	let { dispute }: { dispute: Dispute } = $props();
</script>

<!-- todo: translations-->

<div class="shadow-box">
	{#each dispute.claims as claim, index (index)}
		<div class="claim">
			<span>{claim.author}:</span>
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
		margin: 30px 0px;
	}
</style>
