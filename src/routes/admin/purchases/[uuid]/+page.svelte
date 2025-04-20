<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Payment } from '$lib/models/Payment';
	import { getPaymentByUUID } from '$lib/services/payments';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDate, getFormattedPrice } from '$lib/utils/utils';
	import { defaultCurrency } from '$lib/stores/currency/store';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';

	let payment: Payment | null = $state(null);

	onMount(async () => {
		const { uuid } = $page.params;

		try {
			payment = await getPaymentByUUID(window.fetch, uuid);
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
			goto('/admin/purchases');
		} finally {
			loading.set(false);
		}
	});

	function getTranslatedStatus(status: string): string {
		return getTranslation(`purchases.status.${status.toLowerCase()}`);
	}
</script>

<section>
	{#if payment}
		<div class="payment-details">
			<h1>{getTranslation('purchases.title')}</h1>
			
			<div class="info-section">
				<h2>{getTranslation('purchases.details.paymentDate')}</h2>
				<div class="info-grid">
					<div class="info-item">
						<span class="label">{getTranslation('purchases.details.paymentDate')}:</span>
						<span class="value">{getFormattedDate(payment.createdAtTimestamp)}</span>
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
						<span class="status-cell" 
							class:awaiting={payment.status === 'AWAITING_BLOCKCHAIN_TRANSACTION' || 
								payment.status === 'AWAITING_BLOCKCHAIN_CONFIRMATION' || 
								payment.status === 'AWAITING_FULL_FUNDS'}
							class:confirmed={payment.status === 'BLOCKCHAIN_CONFIRMED'}
							class:expired={payment.status === 'EXPIRED'}>
							{getTranslatedStatus(payment.status)}
						</span>
					</div>
				</div>
			</div>

			<div class="videos-section">
				<h2>{getTranslation('purchases.details.videos')}</h2>
				<DataTable style="width: 100%;">
					<Head>
						<Row>
							<Cell>{getTranslation('purchases.details.videoTitle')}</Cell>
							<Cell>{getTranslation('purchases.details.videoPrice')}</Cell>
							<Cell>{getTranslation('purchases.details.modelName')}</Cell>
							<Cell>{getTranslation('purchases.details.downloadLink')}</Cell>
							<Cell>{getTranslation('purchases.details.downloadInstructions')}</Cell>
						</Row>
					</Head>
					<Body>
						{#each payment.videos as video}
							<Row>
								<Cell>{video.title}</Cell>
								<Cell>
									{getFormattedPrice({
										currency: defaultCurrency,
										value: video.priceInCentsOfDollar / 100
									})}
								</Cell>
								<Cell>{video.model || '-'}</Cell>
								<Cell>
									{#if video.downloadLink}
										<a href={video.downloadLink} target="_blank" rel="noopener noreferrer">
											{getTranslation('purchases.details.downloadLink')}
										</a>
									{:else}
										-
									{/if}
								</Cell>
								<Cell>{video.downloadLinkInstructions || '-'}</Cell>
							</Row>
						{/each}
					</Body>
				</DataTable>
			</div>

			<div class="actions">
				<Button variant="raised" style="margin-right: 1rem;">
					<Label>{getTranslation('purchases.details.confirmPurchase')}</Label>
				</Button>
				<Button variant="outlined" class="dispute-button">
					<Label>{getTranslation('purchases.details.openDispute')}</Label>
				</Button>
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}

	h1 {
		margin-bottom: 2rem;
		font-size: 1.5rem;
		color: #333;
	}

	h2 {
		font-size: 1.2rem;
		color: #555;
		margin-bottom: 1rem;
	}

	.payment-details {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

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

	.videos-section {
		background: #fff;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
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

	a {
		color: #1976d2;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	@media (max-width: 599px) {
		section {
			padding: 1rem;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}

		.actions {
			flex-direction: column;
		}

		:global(.mdc-data-table) {
			margin: 0 -1rem;
			width: calc(100% + 2rem) !important;
		}
	}
</style>
