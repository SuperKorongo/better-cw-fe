<script lang="ts">
	import HeaderCell from '$lib/components/table/HeaderCell.svelte';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import {
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import type { AdminListVideo } from '$lib/models/Video';
	import { patch } from '$lib/services/admin/videos';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import {
		getFormattedDate,
		getFormattedPrice,
		goToInternalLink,
		handleApiError,
		ifNotLoading
	} from '$lib/utils/utils';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import Switch from '@smui/switch';
	import { allowedRowsPerPage, getTableHeader } from './data';

	let {
		data,
		pagination,
		onChangePagination
	}: {
		data: PaginatedResponse<AdminListVideo>;
		pagination: PaginationType;
		onChangePagination: (data: PaginationType) => void;
	} = $props();

	const onToggleActive = async (video: AdminListVideo): Promise<void> => {
		try {
			video.active = !video.active;
			await patch(video.uuid, { active: video.active });
			toasts.success(
				getTranslation(`admin.myVideos.${video.active ? `videoActivated` : `videoDeactivated`}`)
			);
		} catch (e: unknown) {
			handleApiError(e); // todo: use handleApiError everywhere, there are other places where I am using toasts.error but I should use handleApiError
		}
	};
</script>

{#if $user.data !== null && data !== null}
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
					{#each getTableHeader() as { columnId, label, sortable } (columnId)}
						<HeaderCell {columnId} {label} {sortable} />
					{/each}
				</Row>
			</Head>
			<Body>
				{#each data.data as video, index (index)}
					<Row
						onclick={(e) => {
							goToInternalLink(e, `/admin/my-videos/${video.uuid}`);
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
