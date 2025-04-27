<script lang="ts">
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import type { PaginatedResponse, Pagination as PaginationType } from '$lib/models/Pagination';
	import {
		AWAITING_BLOCKCHAIN_CONFIRMATION_STATUS,
		AWAITING_BLOCKCHAIN_TRANSACTION_STATUS,
		AWAITING_FULL_FUNDS_STATUS,
		BLOCKCHAIN_CONFIRMED_STATUS,
		EXPIRED_STATUS,
		type Payment
	} from '$lib/models/Payment';
	import { defaultCurrency } from '$lib/stores/currency/store';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDateWithTime, getFormattedPrice, ifNotLoading } from '$lib/utils/utils';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import FormField from '@smui/form-field';
	import Switch from '@smui/switch';
	import StatusInfoModal from './StatusInfoModal.svelte';
	import { getTranslatedStatus } from './utils';

	let {
		data,
		pagination,
		onChangePagination,
		showPaidOnly,
		onChangeStatusFilter
	}: {
		data: PaginatedResponse<Payment>;
		pagination: PaginationType;
		onChangePagination: (pagination: PaginationType) => void;
		showPaidOnly: boolean;
		onChangeStatusFilter: (showPaidOnly: boolean) => void;
	} = $props();

	const onRowClick = (uuid: string) => {
		loading.set(true);
		goto(`/admin/purchases/${uuid}`);
	};

	let statusModalOpen = $state(false);
	let shouldShowOnlyPaidToggle = (): boolean => {
		return (
			data.data.find((payment) => payment.status === BLOCKCHAIN_CONFIRMED_STATUS) !== undefined
		);
	};
</script>

<div class="table-container">
	<div class="filters">
		{#if shouldShowOnlyPaidToggle()}
			<FormField align="end">
				<Switch
					checked={showPaidOnly}
					onclick={() => {
						ifNotLoading(() => {
							onChangeStatusFilter(!showPaidOnly);
						});
					}}
				/>
				<span>{getTranslation('purchases.table.showOnlyPaid')}</span>
			</FormField>
		{/if}
	</div>

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
			rowsPerPageOptions={[10, 25]}
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
						limit: value,
						offset: 0
					});
				})}
		/>
	{/if}
</div>

<StatusInfoModal bind:open={statusModalOpen} />

<style>
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

	.filters {
		margin-bottom: 1rem;
	}
</style>
