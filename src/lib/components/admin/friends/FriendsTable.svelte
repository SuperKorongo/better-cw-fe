<script lang="ts">
	import HeaderCell from '$lib/components/table/HeaderCell.svelte';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Friend } from '$lib/models/FriendRequest';
	import {
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import { acceptFriendRequest, deleteFriendRequest } from '$lib/services/friends';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { goToInternalLink, ifNotLoading } from '$lib/utils/utils';
	import Button from '@smui/button';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import { allowedRowsPerPage, getTableHeader } from './data';

	let {
		data,
		pagination,
		showAcceptedAt = false,
		sentAtLabel = getTranslation('admin.myFriends.sentAt'),
		showSentAt = true,
		actionsColumn,
		onChangePagination
	}: {
		data: PaginatedResponse<Friend>;
		pagination: PaginationType;
		showAcceptedAt?: boolean;
		showSentAt?: boolean;
		sentAtLabel?: string;
		actionsColumn: {
			acceptLabel?: string;
			rejectLabel?: string;
			postAccept?: (requestUUID: string) => void;
			postReject?: (requestUUID: string) => void;
		};
		onChangePagination: (data: PaginationType) => void;
	} = $props();
</script>

{#if $user.data !== null && data !== null}
	<div>
		<DataTable style="width: 100%;">
			<Head>
				<Row>
					{#each getTableHeader() as { columnId, label, sortable } (columnId)}
						{#if !showAcceptedAt && columnId == 'accepted_at'}{:else if !showSentAt && columnId == 'sent_at'}{:else if columnId == 'sent_at'}
							<HeaderCell {columnId} label={sentAtLabel} {sortable} />
						{:else}
							<HeaderCell {columnId} {label} {sortable} />
						{/if}
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
						{#if showAcceptedAt}
							<Cell>
								{friend.acceptedAt ? new Date(friend.acceptedAt!).toLocaleDateString() : ''}
							</Cell>
						{/if}
						{#if showSentAt}
							<Cell>
								{new Date(friend.sentAt).toLocaleDateString()}
							</Cell>
						{/if}
						<Cell>
							{#if actionsColumn.acceptLabel}
								<Button
									variant="raised"
									color="primary"
									onclick={async (e) => {
										e.stopPropagation();

										if ($loading.value) return;

										try {
											loading.set(true);
											await acceptFriendRequest(window.fetch, friend.friendRequestUUID);
											if (actionsColumn.postAccept) {
												actionsColumn.postAccept(friend.friendRequestUUID);
											}
										} catch (e) {
											toasts.error(getTranslation('common.errors.generic'));
										} finally {
											loading.set(false);
										}
									}}
								>
									{actionsColumn.acceptLabel}
								</Button>
							{/if}
							{#if actionsColumn.rejectLabel}
								<Button
									variant="raised"
									color="secondary"
									onclick={async (e) => {
										e.stopPropagation();

										if ($loading.value) return;

										try {
											loading.set(true);
											await deleteFriendRequest(window.fetch, friend.friendRequestUUID);
											if (actionsColumn.postReject) {
												actionsColumn.postReject(friend.friendRequestUUID);
											}
										} catch (e) {
											toasts.error(getTranslation('common.errors.generic'));
										} finally {
											loading.set(false);
										}
									}}
								>
									{actionsColumn.rejectLabel}
								</Button>
							{/if}
						</Cell>
					</Row>
				{/each}
			</Body>

			{#snippet paginate()}
				<Pagination
					rowsPerPageOptions={allowedRowsPerPage}
					{pagination}
					meta={data!.meta}
					rowsPerPageLabel="admin.myFriends.rowsPerPage"
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
	div :global(button.smui-button--color-secondary) {
		background-color: rgb(164, 0, 0) !important;
	}
</style>
