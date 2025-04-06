<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { getBalance } from '$lib/services/admin/balance';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { onClickInternalLink } from '$lib/utils/utils';
	import Button from '@smui/button';
	import { onMount } from 'svelte';

	let balance: { balanceInBTC: number } | null = $state(null);
	let error: string | null = $state(null);

	onMount(async () => {
		try {
			loading.set(true);
			balance = await getBalance();
		} catch (e) {
			error = getTranslation('admin.balance.errors.fetchError');
			toasts.error(error);
		} finally {
			loading.set(false);
		}
	});
</script>

<div class="balance-container">
	{#if balance}
		<div class="balance-info">
			<span class="label">{getTranslation('admin.balance.label')}:</span>
			<span class="amount">
				{balance.balanceInBTC.toFixed(8)} BTC
			</span>
		</div>
		<a onclick={onClickInternalLink} data-sveltekit-preload-data="hover" href="/admin/withdraw">
			<Button variant="raised" color="primary">{getTranslation('admin.balance.withdraw')}</Button>
		</a>
	{:else if error}
		<div class="error">{error}</div>
	{/if}
</div>

<style>
	.balance-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		color: white;
		margin-bottom: 20px;
	}

	.balance-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.label {
		font-weight: bold;
	}

	.amount {
		font-size: 1.2em;
		font-weight: bold;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.error {
		color: white;
		font-weight: bold;
	}

	@media (max-width: 768px) {
		.balance-container {
			flex-direction: column;
			gap: 15px;
			text-align: center;
		}

		.balance-info {
			justify-content: center;
		}
	}
</style>
