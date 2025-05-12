<script lang="ts">
	import Pagination from '$lib/components/table/Pagination.svelte';
	import { CLOSED_DISPUTE_STATUS, OPEN_DISPUTE_STATUS, type Dispute } from '$lib/models/Dispute';
	import type { PaginatedResponse, Pagination as PaginationType } from '$lib/models/Pagination';
	import { language } from '$lib/stores/language/store';
	import { getTranslation } from '$lib/translations';
	import {
		getFormattedDateWithTime,
		goToInternalLink,
		ifNotLoading,
		onClickInternalLink
	} from '$lib/utils/utils';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import { onClickVideo } from './events';

	let {
		data,
		pagination,
		onChangePagination
	}: {
		data: PaginatedResponse<Dispute>;
		pagination: PaginationType;
		onChangePagination: (pagination: PaginationType) => void;
	} = $props();

	const onRowClick = (e: MouseEvent, uuid: string) => {
		goToInternalLink(e, `/admin/disputes/${uuid}`);
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
				<Row style="cursor: pointer" onclick={(e) => onRowClick(e, dispute.uuid)}>
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
					<Cell>
						<a
							data-sveltekit-preload-data="false"
							href={`/${$language}/videos/${dispute.video.uuid}`}
							onclick={(e) => {
								onClickVideo(e, dispute.video);
							}}
							onauxclick={(e) => {
								onClickVideo(e, dispute.video);
							}}
						>
							{dispute.video.title}
						</a>
					</Cell>
					<Cell>
						<a
							data-sveltekit-preload-data="false"
							class="invoice-link"
							onclick={(e: MouseEvent) => {
								e.stopPropagation();
								onClickInternalLink(e);
							}}
							href={`/${$language}/admin/purchases/${dispute.invoice.uuid}`}
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

	a:hover {
		text-decoration: underline !important;
		color: blue !important;
	}
</style>
