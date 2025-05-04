<script lang="ts">
	import {
		AWAITING_BLOCKCHAIN_CONFIRMATION_STATUS,
		AWAITING_BLOCKCHAIN_TRANSACTION_STATUS,
		AWAITING_FULL_FUNDS_STATUS,
		BLOCKCHAIN_CONFIRMED_STATUS,
		EXPIRED_STATUS,
		type Payment
	} from '$lib/models/Payment';
	import { defaultCurrency } from '$lib/stores/currency/store';
	import { getTranslation } from '$lib/translations';
	import {
		getFormattedDateWithTime,
		getFormattedPrice,
		openCryptoWidgetPopup
	} from '$lib/utils/utils';
	import StatusTooltip from './StatusTooltip.svelte';
	import { getTranslatedStatus } from './utils';

	let { payment }: { payment: Payment } = $props();
</script>

<div class="info-section">
	<div class="info-grid">
		<div class="info-item">
			<span class="label">{getTranslation('purchases.details.paymentDate')}:</span>
			<span class="value">{getFormattedDateWithTime(payment.createdAtTimestamp)}</span>
		</div>
		<div class="info-item">
			<span class="label">UUID:</span>
			<span class="value uuid">{payment.uuid}</span>
		</div>
		<div class="info-item">
			<span class="label">{getTranslation('purchases.details.priceUSD')}:</span>
			<span class="value">
				{getFormattedPrice({
					currency: defaultCurrency,
					value: payment.priceInCentsOfDollar / 100
				})}
			</span>
		</div>
		<div class="info-item">
			<span class="label">{getTranslation('purchases.details.priceBTC')}:</span>
			<span class="value">{payment.priceInBTC} BTC</span>
		</div>
		<div class="info-item status-item">
			<div class="status-header">
				<StatusTooltip />
			</div>
			<span
				class="status-cell"
				class:awaiting={payment.status === AWAITING_BLOCKCHAIN_TRANSACTION_STATUS ||
					payment.status === AWAITING_BLOCKCHAIN_CONFIRMATION_STATUS ||
					payment.status === AWAITING_FULL_FUNDS_STATUS}
				class:confirmed={payment.status === BLOCKCHAIN_CONFIRMED_STATUS}
				class:expired={payment.status === EXPIRED_STATUS}
			>
				{getTranslatedStatus(payment.status)}
			</span>
		</div>
	</div>
</div>

{#if payment.status !== BLOCKCHAIN_CONFIRMED_STATUS && payment.status !== EXPIRED_STATUS}
	<div class="pay-button-container">
		<button
			onclick={() => {
				openCryptoWidgetPopup(payment.externalUuid);
			}}
			class="pay-button"
		>
			{getTranslation('purchases.details.payInvoice')}
		</button>
	</div>
{/if}

<style>
	.info-section {
		background: #fff;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		font-size: 0.9rem;
		color: #666;
	}

	.value {
		font-size: 1.1rem;
		color: #333;
		font-weight: 500;
	}

	.status-cell {
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-size: 0.9rem;
		font-weight: 700;
		display: inline-block;
		text-align: center;
		min-width: 140px;
	}

	.status-item {
		align-items: flex-start;
		margin-top: -0.5rem;
	}

	.status-header {
		margin-bottom: 0.25rem;
	}

	.status-cell.awaiting {
		background-color: #fff3cd;
		color: #856404;
	}

	.status-cell.confirmed {
		background-color: #d4edda;
		color: #155724;
	}

	.status-cell.expired {
		background-color: #f8d7da;
		color: #721c24;
	}

	.uuid {
		font-family: monospace;
		font-size: 1rem;
	}

	@media (max-width: 599px) {
		.info-grid {
			grid-template-columns: 1fr;
		}
	}

	.pay-button-container {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	.pay-button {
		position: relative;
		padding: 16px 32px;
		border: none;
		border-radius: 12px;
		font-size: 1.2rem;
		font-weight: 600;
		color: white;
		cursor: pointer;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: rgb(0, 0, 160);
	}

	.pay-button:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 15px 30px rgba(71, 118, 230, 0.2); /* Matching shadow color to the primary blue */
		animation: moveGradient 2s ease infinite;
	}

	.pay-button:active {
		transform: translateY(1px) scale(0.98);
	}

	@keyframes moveGradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
