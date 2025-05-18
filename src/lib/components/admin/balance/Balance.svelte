<script lang="ts">
	import { page } from '$app/state';
	import { getBalance, type Balance } from '$lib/services/admin/balance';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { getHrefWithLanguage, handleApiError, onClickInternalLink } from '$lib/utils/utils';
	import Button from '@smui/button';
	import { onMount } from 'svelte';

	let balance: Balance | null = $state(null);

	onMount(async () => {
		try {
			loading.set(true);
			balance = await getBalance();
			user.setBalance(balance);
		} catch (e: unknown) {
			handleApiError(e, 'admin.balance.errors.fetchError');
		} finally {
			loading.set(false);
		}
	});
</script>

<div class="balance-container">
	{#if user.isAdmin()}
		Admin Mode
	{:else}
		<div class="balance-info">
			<span class="label">{getTranslation('admin.balance.label')}:</span>
			<span class="amount">
				~{balance ? balance.netBalanceInBTC : ''} BTC
			</span>
		</div>

		{#if page.route.id !== '/admin/withdraw'}
			<a
				onclick={onClickInternalLink}
				data-sveltekit-preload-data="false"
				href={getHrefWithLanguage('/admin/withdraw')}
			>
				<Button variant="raised" color="primary">{getTranslation('admin.balance.withdraw')}</Button>
			</a>
		{:else}
			<span style="display: block; padding: 18px 0px"></span>
		{/if}
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
