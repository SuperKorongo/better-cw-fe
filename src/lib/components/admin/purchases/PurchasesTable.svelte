<script lang="ts">
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import type { PaginatedResponse, Pagination as PaginationType } from '$lib/models/Pagination';
	import type { Payment } from '$lib/models/Payment';
	import { loading } from '$lib/stores/loading/store';
	import HeaderCell from '$lib/components/table/HeaderCell.svelte';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import { getFormattedDate, getFormattedPrice } from '$lib/utils/utils';
	import { defaultCurrency } from '$lib/stores/currency/store';
	import { tableHeader, allowedRowsPerPage } from './data';
	import { goto } from '$app/navigation';
	import { getTranslatedStatus } from './utils';

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
</script>

<div>
	<DataTable style="width: 100%;">
		<Head>
			<Row>
				{#each tableHeader as { columnId, label } (columnId)}
					<HeaderCell {columnId} {label} />
				{/each}
			</Row>
		</Head>
		<Body>
			{#each data.data as payment (payment.uuid)}
				<Row style="cursor: pointer" onclick={() => onRowClick(payment.uuid)}>
					<Cell>{payment.uuid}</Cell>
					<Cell>{getFormattedDate(payment.createdAtTimestamp)}</Cell>
					<Cell
						>{getFormattedPrice({
							currency: defaultCurrency,
							value: payment.priceInCentsOfDollar / 100
						})}</Cell
					>
					<Cell>{payment.priceInBTC} BTC</Cell>
					<Cell>
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
					</Cell>
					<Cell>
						<span class="videos-cell" title={payment.videos.map((v) => v.title).join(', ')}>
							{payment.videos.map((v) => v.title).join(', ')}
						</span>
					</Cell>
				</Row>
			{/each}
		</Body>

		{#snippet paginate()}
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
		{/snippet}
	</DataTable>
</div>

<style>
	div :global(.mdc-data-table__row):nth-child(even) {
		background-color: #fdfdfd;
	}

	div :global(.mdc-data-table__row):hover {
		background-color: #eee;
	}

	.status-cell {
		font-weight: bold;
	}

	.awaiting {
		color: #ff9800;
	}

	.confirmed {
		color: #4caf50;
	}

	.expired {
		color: #f44336;
	}

	.videos-cell {
		display: block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
