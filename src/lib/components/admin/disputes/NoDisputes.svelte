<script lang="ts">
	import { getTranslation } from '$lib/translations';

	let { whose }: { whose: 'buyer' | 'seller' } = $props();
</script>

<div class="empty-state">
	{#if whose === 'buyer'}
		{getTranslation('disputes.noBuyerDisputes1')}
		<br /><br />
		{getTranslation('disputes.noBuyerDisputes2')}
		<br /><br />
		{getTranslation('disputes.noBuyerDisputes3')}
	{/if}

	{#if whose === 'seller'}
		{getTranslation('disputes.noSellerDisputes1')}
		<br /><br />
		{getTranslation('disputes.noSellerDisputes2')}
		<br /><br />
		{getTranslation('disputes.noSellerDisputes3')}
	{/if}
</div>

<style>
	div {
		background: #fff;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
