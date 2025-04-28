<script lang="ts">
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import { CLOSED_DISPUTE_STATUS, OPEN_DISPUTE_STATUS, type Dispute } from '$lib/models/Dispute';
	import type { PaginatedResponse, Pagination as PaginationType } from '$lib/models/Pagination';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDateWithTime, ifNotLoading, onClickInternalLink } from '$lib/utils/utils';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';

	let {
		data,
		pagination,
		onChangePagination
	}: {
		data: PaginatedResponse<Dispute>;
		pagination: PaginationType;
		onChangePagination: (pagination: PaginationType) => void;
	} = $props();

	const onRowClick = (uuid: string) => {
		loading.set(true);
		goto(`/admin/disputes/${uuid}`);
	};
</script>

<div class="table-container">
	<DataTable style="width: 100%;">
		<Head>
			<Row>
				<Cell>{getTranslation('disputes.table.createdAt')}</Cell>
				<Cell>{getTranslation('disputes.table.updatedAt')}</Cell>
				<Cell>{getTranslation('disputes.table.lastComment')}</Cell>
				<Cell>{getTranslation('disputes.table.status')}</Cell>
				<Cell>{getTranslation('disputes.table.videoTitle')}</Cell>
				<Cell>{getTranslation('disputes.table.invoiceUuid')}</Cell>
			</Row>
		</Head>
		<Body>
			{#each data.data as dispute (dispute.uuid)}
				<Row style="cursor: pointer" onclick={() => onRowClick(dispute.uuid)}>
					<Cell>{getFormattedDateWithTime(dispute.createdAtTimestamp)}</Cell>
					<Cell>{getFormattedDateWithTime(dispute.updatedAtTimestamp)}</Cell>
					<Cell
						><span title={dispute.claims[0].contents} class="last-comment"
							>{dispute.claims[0].contents}</span
						></Cell
					>
					<Cell>
						<span
							class="status-cell"
							class:open={dispute.status === OPEN_DISPUTE_STATUS}
							class:closed={dispute.status === CLOSED_DISPUTE_STATUS}
						>
							{dispute.status === OPEN_DISPUTE_STATUS ? `❗` : `✅`}
						</span>
					</Cell>
					<Cell>{dispute.video.title}</Cell>
					<Cell>
						<a
							class="invoice-link"
							onclick={(e: MouseEvent) => {
								e.stopPropagation();
								onClickInternalLink(e);
							}}
							href={`/admin/purchases/${dispute.invoice.uuid}`}
						>
							{dispute.invoice.uuid}
						</a>
					</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>

	{#if data}
		<Pagination
			rowsPerPageOptions={[10]}
			{pagination}
			meta={data.meta}
			rowsPerPageLabel="disputes.table.rowsPerPage"
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

	.closed {
		color: #155724;
		background-color: #d4edda;
	}

	.open {
		color: #721c24;
		background-color: #f8d7da;
	}

	.last-comment {
		display: inline-block;
		max-width: 50ch;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.invoice-link:hover {
		text-decoration: underline !important;
		color: blue !important;
	}
</style>
