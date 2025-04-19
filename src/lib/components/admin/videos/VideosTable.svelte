<script lang="ts">
	import { goto } from '$app/navigation';
	import HeaderCell from '$lib/components/table/HeaderCell.svelte';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import {
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import type { AdminListVideo } from '$lib/models/Video';
	import { patch } from '$lib/services/admin/videos';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDate, getFormattedPrice } from '$lib/utils/utils';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import Switch from '@smui/switch';
	import { allowedRowsPerPage, tableHeader } from './data';

	let {
		data,
		pagination,
		onChangePagination
	}: {
		data: PaginatedResponse<AdminListVideo>;
		pagination: PaginationType;
		onChangePagination: (data: PaginationType) => void;
	} = $props();

	const ifNotLoading = (action: () => void) => {
		if ($loading.value) return;
		action();
	};

	const onToggleActive = async (video: AdminListVideo): Promise<void> => {
		try {
			await patch(video.uuid, { active: !video.active });
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
		}
	};
</script>

{#if $user.data !== null && data !== null && data.data.length > 0}
	<div>
		<DataTable
			sortable
			style="width: 100%;"
			onSMUIDataTableSorted={({ detail }) => {
				ifNotLoading(() => {
					onChangePagination({
						limit: pagination.limit,
						offset: 0,
						orderBy: {
							column: detail.columnId,
							direction: detail.sortValue === 'ascending' ? 'asc' : 'desc'
						}
					});
				});
			}}
		>
			<Head>
				<Row>
					{#each tableHeader as { columnId, label, sortable } (columnId)}
						<HeaderCell {columnId} {label} {sortable} />
					{/each}
				</Row>
			</Head>
			<Body>
				{#each data.data as video, index (index)}
					<Row
						onclick={() => {
							loading.set(true);
							goto(`/admin/my-videos/${video.uuid}`);
						}}
						style="cursor: pointer"
					>
						<Cell>{video.title}</Cell>
						<Cell>{getFormattedPrice(video.price)}</Cell>
						<Cell>{getFormattedDate(video.uploadedAtTimestamp)}</Cell>
						<Cell>{video.moneyGeneratedInBTC} BTC</Cell>
						<Cell>
							<Switch
								onclick={async (e: Event) => {
									e.stopPropagation();
									onToggleActive(video);
								}}
								checked={video.active}
							/>
						</Cell>
					</Row>
				{/each}
			</Body>

			{#snippet paginate()}
				<Pagination
					rowsPerPageOptions={allowedRowsPerPage}
					{pagination}
					meta={data!.meta}
					rowsPerPageLabel="admin.myVideos.rowsPerPage"
					ofLabel="admin.myVideos.of"
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
								offset: data!.meta.totalItems - pagination.limit
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
{/if}

<style>
	div :global(.mdc-data-table__row):nth-child(even) {
		background-color: #fdfdfd;
	}
	div :global(.mdc-data-table__row):hover {
		background-color: #eee;
	}
</style>
