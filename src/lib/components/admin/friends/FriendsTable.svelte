<script lang="ts">
	import HeaderCell from '$lib/components/table/HeaderCell.svelte';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import type { Friend } from '$lib/models/FriendRequest';
	import {
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import { user } from '$lib/stores/user/store';
	import { goToInternalLink, ifNotLoading } from '$lib/utils/utils';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import { allowedRowsPerPage, tableHeader } from './data';

	let {
		data,
		pagination,
		onChangePagination
	}: {
		data: PaginatedResponse<Friend>;
		pagination: PaginationType;
		onChangePagination: (data: PaginationType) => void;
	} = $props();
</script>

{#if $user.data !== null && data !== null && data.data.length > 0}
	<div>
		<DataTable style="width: 100%;">
			<Head>
				<Row>
					{#each tableHeader as { columnId, label, sortable } (columnId)}
						<HeaderCell {columnId} {label} {sortable} />
					{/each}
				</Row>
			</Head>
			<Body>
				{#each data.data as friend, index (index)}
					<Row
						onclick={(e) => {
							goToInternalLink(e, `/users/${friend.slug}`);
						}}
						style="cursor: pointer"
					>
						<Cell>{friend.username}</Cell>
						<Cell>{new Date(friend.acceptedAt!).toLocaleDateString()}</Cell>
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
