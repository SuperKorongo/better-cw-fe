<script lang="ts">
	import { getAddressInfo } from 'bitcoin-address-validation';

	import WithdrawalsTable from '$lib/components/admin/withdrawals/WithdrawalsTable.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import { createWithdrawal } from '$lib/services/admin/withdrawals';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { onMount } from 'svelte';

	let btcAddress: string = $state('');
	let amount: number = $state(0);

	onMount(() => {
		loading.set(false);
	});

	function validateBTCAddress(address: string): boolean {
		try {
			const info = getAddressInfo(address);
			return info.network === 'mainnet';
		} catch (error) {
			return false;
		}
	}

	async function handleWithdraw() {
		if ($loading.value) return;
		if (!validateBTCAddress(btcAddress)) {
			toasts.error(getTranslation('withdraw.errors.invalidAddress'));
			return;
		}

		if (amount <= 0 || amount > $user.balance!) {
			toasts.error(getTranslation('withdraw.errors.invalidAmount'));
			return;
		}

		loading.set(true);
		try {
			await createWithdrawal(btcAddress, amount);
			toasts.success(getTranslation('withdraw.success'));
			btcAddress = '';
			amount = 0;
		} catch (error) {
			toasts.error(getTranslation('withdraw.errors.serverError'));
		} finally {
			loading.set(false);
		}
	}
</script>

<main>
	<h1>{getTranslation('withdraw.title')}</h1>

	<div class="withdraw-form">
		<div class="form-group">
			<label for="btc-address">{getTranslation('withdraw.btcAddress')}</label>
			<input
				type="text"
				id="btc-address"
				bind:value={btcAddress}
				placeholder={getTranslation('withdraw.placeholders.btcAddress')}
			/>
		</div>

		<div class="form-group">
			<label for="amount">{getTranslation('withdraw.amount')}</label>
			<div class="amount-input-container">
				<input
					type="number"
					id="amount"
					bind:value={amount}
					step="0.00000001"
					min="0"
					max={$user.balance || 0}
					placeholder={getTranslation('withdraw.placeholders.amount')}
				/>
				<button
					type="button"
					class="max-button"
					onclick={() => (amount = $user.balance || 0)}
					title={getTranslation('withdraw.maxAmount')}
				>
					Max
				</button>
			</div>
			{#if amount > ($user.balance || 0)}
				<p class="error-message">{getTranslation('withdraw.errors.insufficientFunds')}</p>
			{/if}
		</div>

		<button onclick={handleWithdraw} class="withdraw-button">
			{getTranslation('withdraw.withdrawButton')}
		</button>
	</div>

	<WithdrawalsTable />
</main>

<style>
	main {
		padding: 20px;
	}

	h1 {
		margin-bottom: 30px;
		text-align: center;
	}

	.withdraw-form {
		max-width: 500px;
		margin: 0 auto 40px;
		padding: 20px;
		background-color: #f5f5f5;
		border-radius: 8px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 8px;
		font-weight: bold;
	}

	input {
		width: calc(100% - 20px);
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 16px;
	}

	.amount-input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.max-button {
		position: absolute;
		right: 8px;
		padding: 4px 8px;
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 12px;
		cursor: pointer;
		transition: opacity 0.3s;
	}

	.max-button:hover {
		opacity: 0.9;
	}

	input[type='number'] {
		padding-right: 50px; /* Make room for the Max button */
	}

	.withdraw-button {
		width: 100%;
		padding: 12px;
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		border: none;
		border-radius: 25px;
		color: white;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		margin-top: 20px;
		transition: opacity 0.3s;
	}

	.withdraw-button:hover {
		opacity: 0.9;
	}

	.error-message {
		color: #c62828;
		font-size: 14px;
		margin-top: 4px;
	}

	input:invalid {
		border-color: #c62828;
	}
</style>
