<script lang="ts">
	import { page } from '$app/state';
	import * as toasts from '$lib/components/toasts/toasts';
	import { getBalance } from '$lib/services/admin/balance';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
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
			user.setBalance(balance.balanceInBTC);
		} catch (e) {
			error = getTranslation('admin.balance.errors.fetchError');
			toasts.error(error);
		} finally {
			loading.set(false);
		}
	});
</script>

<div class="balance-container">
	<div class="balance-info">
		<span class="label">{getTranslation('admin.balance.label')}:</span>
		<span class="amount">
			~{balance ? balance.balanceInBTC : ''} BTC
		</span>
	</div>

	{#if page.route.id !== '/admin/withdraw'}
		<a onclick={onClickInternalLink} data-sveltekit-preload-data="hover" href="/admin/withdraw">
			<Button variant="raised" color="primary">{getTranslation('admin.balance.withdraw')}</Button>
		</a>
	{:else}
		<span style="display: block; padding: 18px 0px"></span>
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
		position: sticky;
		top: var(--navbar-height);
		z-index: 100;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
