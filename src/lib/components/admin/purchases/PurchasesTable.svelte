<script lang="ts">
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import type { PaginatedResponse, Pagination as PaginationType } from '$lib/models/Pagination';
	import {
		AWAITING_BLOCKCHAIN_CONFIRMATION_STATUS,
		AWAITING_BLOCKCHAIN_TRANSACTION_STATUS,
		AWAITING_FULL_FUNDS_STATUS,
		BLOCKCHAIN_CONFIRMED_STATUS,
		EXPIRED_STATUS,
		type Payment
	} from '$lib/models/Payment';
	import { loading } from '$lib/stores/loading/store';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import { getFormattedDateWithTime, getFormattedPrice } from '$lib/utils/utils';
	import { defaultCurrency } from '$lib/stores/currency/store';
	import { allowedRowsPerPage } from './data';
	import { goto } from '$app/navigation';
	import { getTranslatedStatus } from './utils';
	import StatusInfoModal from './StatusInfoModal.svelte';
	import { getTranslation } from '$lib/translations';

	let {
		data,
		pagination,
		onChangePagination
	}: {
		data: PaginatedResponse<Payment>;
		pagination: PaginationType;
		onChangePagination: (pagination: PaginationType) => void;
	} = $props();

	const ifNotLoading = (action: () => void) => {
		if ($loading.value) return;
		action();
	};

	const onRowClick = (uuid: string) => {
		loading.set(true);
		goto(`/admin/purchases/${uuid}`);
	};

	let statusModalOpen = $state(false);
</script>

<div class="table-container">
	<DataTable style="width: 100%;">
		<Head>
			<Row>
				<Cell>{getTranslation('purchases.table.createdAt')}</Cell>
				<Cell>{getTranslation('purchases.table.uuid')}</Cell>
				<Cell>{getTranslation('purchases.table.priceUSD')}</Cell>
				<Cell>{getTranslation('purchases.table.priceBTC')}</Cell>
				<Cell>
					<div class="status-header">
						<span>{getTranslation('purchases.table.status')}</span>
						<button class="info-icon" onclick={() => (statusModalOpen = true)}>?</button>
					</div>
				</Cell>
				<Cell>{getTranslation('purchases.table.videos')}</Cell>
			</Row>
		</Head>
		<Body>
			{#each data.data as payment (payment.uuid)}
				<Row style="cursor: pointer" onclick={() => onRowClick(payment.uuid)}>
					<Cell>{getFormattedDateWithTime(payment.createdAtTimestamp)}</Cell>
					<Cell>{payment.uuid}</Cell>
					<Cell>
						{getFormattedPrice({
							currency: defaultCurrency,
							value: payment.priceInCentsOfDollar / 100
						})}
					</Cell>
					<Cell>{payment.priceInBTC} BTC</Cell>
					<Cell>
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
					</Cell>
					<Cell>
						<span class="videos-cell" title={payment.videos.map((v) => v.title).join(', ')}>
							{payment.videos.map((v) => v.title).join(', ')}
						</span>
					</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>

	{#if data}
		<Pagination
			rowsPerPageOptions={allowedRowsPerPage}
			{pagination}
			meta={data.meta}
			rowsPerPageLabel="purchases.table.rowsPerPage"
			ofLabel="purchases.table.of"
			onFirstPage={() =>
				ifNotLoading(() => {
					onChangePagination({
						...pagination,
						offset: 0
					});
				})}
			onPreviousPage={() =>
				ifNotLoading(() => {
					onChangePagination({
						...pagination,
						offset: pagination.offset - pagination.limit
					});
				})}
			onNextPage={() =>
				ifNotLoading(() => {
					onChangePagination({
						...pagination,
						offset: pagination.offset + pagination.limit
					});
				})}
			onLastPage={() =>
				ifNotLoading(() => {
					onChangePagination({
						...pagination,
						offset: data.meta.totalItems - pagination.limit
					});
				})}
			onChangeRowsPerPage={(value: number) =>
				ifNotLoading(() => {
					onChangePagination({
						...pagination,
						limit: value
					});
				})}
		/>
	{/if}
</div>

<StatusInfoModal bind:open={statusModalOpen} />

<style>
	.table-container {
		position: relative;
	}

	div :global(.mdc-data-table__row):nth-child(even) {
		background-color: #fdfdfd;
	}

	div :global(.mdc-data-table__row):hover {
		background-color: #eee;
	}

	.status-cell {
		font-weight: bold;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		display: inline-block;
	}

	.awaiting {
		color: #ff9800;
		background-color: #fff3cd;
	}

	.confirmed {
		color: #155724;
		background-color: #d4edda;
	}

	.expired {
		color: #721c24;
		background-color: #f8d7da;
	}

	.videos-cell {
		display: block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.mdc-data-table__header-cell) .status-header {
		display: flex;
		align-items: center;
		height: 100%;
	}

	:global(.tooltip-container) {
		z-index: 1100;
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.info-icon {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #666;
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: bold;
	}
</style>
