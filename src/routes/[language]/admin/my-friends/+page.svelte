<script lang="ts">
	import FriendsTable from '$lib/components/admin/friends/FriendsTable.svelte';
	import type { Friend } from '$lib/models/FriendRequest';
	import {
		DEFAULT_PAGINATION,
		type OrderBy,
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import {
		getMyFriends,
		getPendingFriendRequestsReceived,
		getPendingFriendRequestsSent
	} from '$lib/services/friends';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { handleApiError } from '$lib/utils/utils';

	let friends: PaginatedResponse<Friend> | null = $state(null);
	let pendingRequestsSent: PaginatedResponse<Friend> | null = $state(null);
	let pendingRequestsReceived: PaginatedResponse<Friend> | null = $state(null);

	const orderBy: OrderBy = {
		column: 'sent_at',
		direction: 'desc'
	};

	let friendsPagination: PaginationType = $state({
		...structuredClone(DEFAULT_PAGINATION),
		orderBy,
		limit: 10
	});
	let pendingRequestsSentPagination: PaginationType = $state({
		...structuredClone(DEFAULT_PAGINATION),
		orderBy,
		limit: 10
	});
	let pendingRequestsReceivedPagination: PaginationType = $state({
		...structuredClone(DEFAULT_PAGINATION),
		orderBy,
		limit: 10
	});

	$effect(() => {
		if (!$user.ready || $user.data === null) {
			return;
		}

		loading.set(true);
		Promise.all([
			getMyFriends(window.fetch, friendsPagination).then((r) => {
				friends = r;
			}),
			getPendingFriendRequestsSent(window.fetch, pendingRequestsSentPagination).then((r) => {
				pendingRequestsSent = r;
			}),
			getPendingFriendRequestsReceived(window.fetch, pendingRequestsReceivedPagination).then(
				(r) => {
					pendingRequestsReceived = r;
				}
			)
		])
			.catch(handleApiError)
			.finally(() => loading.set(false));
	});
</script>

<section>
	<div class="friends-section">
		{#if $user.data !== null && friends !== null && friends.data.length > 0}
			<FriendsTable
				data={friends}
				pagination={friendsPagination}
				onChangePagination={(newPagination) => {
					friendsPagination = newPagination;
				}}
			/>
		{/if}
	</div>
	<div class="friends-section">
		{#if $user.data !== null && pendingRequestsSent !== null && pendingRequestsSent.data.length > 0}
			Pending sent {pendingRequestsSent}
		{/if}
	</div>
	<div class="friends-section">
		{#if $user.data !== null && pendingRequestsReceived !== null && pendingRequestsReceived.data.length > 0}
			Pending received {pendingRequestsReceived}
		{/if}
	</div>
</section>

<style>
	section {
		padding: 30px 50px;
	}
</style>
