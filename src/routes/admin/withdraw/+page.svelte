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
		} catch {
			return false;
		}
	}

	async function handleWithdraw() {
		if ($loading.value) return;
		if (!validateBTCAddress(btcAddress)) {
			toasts.error(getTranslation('withdraw.errors.invalidAddress'));
			return;
		}

		if (amount <= 0 || amount > $user.balance!.netBalanceInBTC) {
			toasts.error(getTranslation('withdraw.errors.invalidAmount'));
			return;
		}

		loading.set(true);
		try {
			await createWithdrawal(btcAddress, amount);
			toasts.success(getTranslation('withdraw.success'));
			btcAddress = '';
			amount = 0;
		} catch {
			toasts.error(getTranslation('withdraw.errors.serverError'));
		} finally {
			loading.set(false);
		}
	}
</script>

<main>
	{#if $user.balance !== null}
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
						max={$user.balance!.netBalanceInBTC || 0}
						placeholder={getTranslation('withdraw.placeholders.amount')}
					/>
					<button
						type="button"
						class="max-button"
						onclick={() => (amount = $user.balance!.netBalanceInBTC || 0)}
						title={getTranslation('withdraw.maxAmount')}
					>
						Max
					</button>
				</div>
				{#if amount > ($user.balance!.netBalanceInBTC || 0)}
					<p class="error-message">{getTranslation('withdraw.errors.insufficientFunds')}</p>
				{/if}
			</div>

			<button onclick={handleWithdraw} class="withdraw-button">
				{getTranslation('withdraw.withdrawButton')}
			</button>
		</div>

		<WithdrawalsTable />
	{/if}
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
		background: linear-gradient(135deg, #f6f8ff 0%, #f0f4ff 50%, #e8f0ff 100%);
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}

	.withdraw-form::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #3cff3f88, #00c1be);
	}

	.form-group {
		margin-bottom: 20px;
		position: relative;
		z-index: 1;
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
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		box-shadow: 0 4px 15px rgba(64, 196, 255, 0.2);
	}

	.withdraw-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(64, 196, 255, 0.4);
		background: linear-gradient(45deg, #a23cff, #40c4ff);
	}

	.withdraw-button:active {
		transform: translateY(1px);
		box-shadow: 0 2px 10px rgba(64, 196, 255, 0.2);
	}

	.withdraw-button::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: 0.5s;
	}

	.withdraw-button:hover::after {
		left: 100%;
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
