<script lang="ts">
	import type { Payment } from '$lib/models/Payment';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDateWithTime, getFormattedPrice } from '$lib/utils/utils';
	import { defaultCurrency } from '$lib/stores/currency/store';
	import { getTranslatedStatus } from './utils';

	let { payment }: { payment: Payment } = $props();
</script>

<div class="info-section">
	<h2>{getTranslation('purchases.details.paymentDate')}</h2>
	<div class="info-grid">
		<div class="info-item">
			<span class="label">{getTranslation('purchases.details.paymentDate')}:</span>
			<span class="value">{getFormattedDateWithTime(payment.createdAtTimestamp)}</span>
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
		<div class="info-item">
			<span class="label">{getTranslation('purchases.table.status')}:</span>
			<span
				class="status-cell"
				class:awaiting={payment.status === 'AWAITING_BLOCKCHAIN_TRANSACTION' ||
					payment.status === 'AWAITING_BLOCKCHAIN_CONFIRMATION' ||
					payment.status === 'AWAITING_FULL_FUNDS'}
				class:confirmed={payment.status === 'BLOCKCHAIN_CONFIRMED'}
				class:expired={payment.status === 'EXPIRED'}
			>
				{getTranslatedStatus(payment.status)}
			</span>
		</div>
	</div>
</div>

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
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.9rem;
		font-weight: 500;
		display: inline-block;
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

	@media (max-width: 599px) {
		.info-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
