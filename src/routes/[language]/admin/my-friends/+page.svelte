<script lang="ts">
	import FriendsTable from '$lib/components/admin/friends/FriendsTable.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import Textfield from '@smui/textfield';

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
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { handleApiError } from '$lib/utils/utils';
	import Accordion, { Content, Header, Panel } from '@smui-extra/accordion';
	import { get } from 'svelte/store';

	let friends: PaginatedResponse<Friend> | null = $state(null);
	let pendingRequestsSent: PaginatedResponse<Friend> | null = $state(null);
	let pendingRequestsReceived: PaginatedResponse<Friend> | null = $state(null);

	let friendsSearch: string = $state('');
	let pendingRequestsSentSearch: string = $state('');
	let pendingRequestsReceivedSearch: string = $state('');

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
		$cacheInvalidation.myFriends;

		if (!$user.ready || $user.data === null) {
			return;
		}

		if (
			get(loading).value &&
			(friendsSearch.length > 0 ||
				pendingRequestsSentSearch.length > 0 ||
				pendingRequestsReceivedSearch.length > 0)
		) {
			return;
		}

		loading.set(true);
		Promise.all([
			getMyFriends(
				window.fetch,
				friendsPagination,
				friendsSearch.length > 2 ? friendsSearch : ''
			).then((r) => {
				friends = r;
			}),
			getPendingFriendRequestsSent(
				window.fetch,
				pendingRequestsSentPagination,
				pendingRequestsSentSearch.length > 2 ? pendingRequestsSentSearch : ''
			).then((r) => {
				pendingRequestsSent = r;
			}),
			getPendingFriendRequestsReceived(
				window.fetch,
				pendingRequestsReceivedPagination,
				pendingRequestsReceivedSearch.length > 2 ? pendingRequestsReceivedSearch : ''
			).then((r) => {
				pendingRequestsReceived = r;
			})
		])
			.catch(handleApiError)
			.finally(() => loading.set(false));
	});
</script>

<section>
	<Accordion multiple>
		<Panel open>
			<Header>
				<span class="accordion-title">
					{getTranslation('admin.myFriends.friendRequestsReceivedTableTitle')}
				</span>
			</Header>
			<Content>
				{#if pendingRequestsReceivedSearch.length > 0 || ($user.data !== null && pendingRequestsReceived !== null && pendingRequestsReceived.data.length > 0)}
					<div class="search-term">
						<Textfield
							label={getTranslation('homepage.filters.searchTerm')}
							bind:value={pendingRequestsReceivedSearch}
						/>
					</div>
					<FriendsTable
						data={pendingRequestsReceived!}
						pagination={pendingRequestsReceivedPagination}
						onChangePagination={(newPagination) => {
							pendingRequestsReceivedPagination = newPagination;
						}}
						sentAtLabel={getTranslation('admin.myFriends.receivedAt')}
						actionsColumn={{
							acceptLabel: getTranslation('admin.myFriends.accept'),
							rejectLabel: getTranslation('admin.myFriends.reject'),
							postReject: () => {
								cacheInvalidation.refreshMyFriends();
								toasts.warning(getTranslation('admin.myFriends.requestRejected'));
							},
							postAccept: () => {
								cacheInvalidation.refreshMyFriends();
								toasts.success(getTranslation('admin.myFriends.requestAccepted'));
							}
						}}
					/>
				{/if}
				{#if pendingRequestsReceivedSearch.length === 0 && $user.data !== null && pendingRequestsReceived !== null && pendingRequestsReceived.data.length === 0}
					<div class="no-data">{getTranslation('admin.myFriends.noFriendRequestseReceived')}</div>
				{/if}
			</Content>
		</Panel>
		<Panel open>
			<Header>
				<span class="accordion-title">
					{getTranslation('admin.myFriends.friendRequestsSentTableTitle')}
				</span>
			</Header>
			<Content>
				{#if pendingRequestsSentSearch.length > 0 || ($user.data !== null && pendingRequestsSent !== null && pendingRequestsSent.data.length > 0)}
					<div class="search-term">
						<Textfield
							label={getTranslation('homepage.filters.searchTerm')}
							bind:value={pendingRequestsSentSearch}
						/>
					</div>
					<FriendsTable
						data={pendingRequestsSent!}
						pagination={pendingRequestsSentPagination}
						onChangePagination={(newPagination) => {
							pendingRequestsSentPagination = newPagination;
						}}
						actionsColumn={{
							rejectLabel: getTranslation('admin.myFriends.cancel'),
							postReject: () => {
								cacheInvalidation.refreshMyFriends();
								toasts.warning(getTranslation('admin.myFriends.requestCancelled'));
							}
						}}
					/>
				{/if}
				{#if pendingRequestsSentSearch.length === 0 && $user.data !== null && pendingRequestsSent !== null && pendingRequestsSent.data.length === 0}
					<div class="no-data">{getTranslation('admin.myFriends.noFriendRequestsSent')}</div>
				{/if}
			</Content>
		</Panel>
		<Panel open>
			<Header>
				<span class="accordion-title">
					{getTranslation('admin.myFriends.friendsTableTitle')}
				</span>
			</Header>
			<Content>
				{#if friendsSearch.length > 0 || ($user.data !== null && friends !== null && friends.data.length > 0)}
					<div class="search-term">
						<Textfield
							label={getTranslation('homepage.filters.searchTerm')}
							bind:value={friendsSearch}
						/>
					</div>
					<FriendsTable
						showAcceptedAt
						showSentAt={false}
						data={friends!}
						pagination={friendsPagination}
						onChangePagination={(newPagination) => {
							friendsPagination = newPagination;
						}}
						actionsColumn={{
							rejectLabel: getTranslation('admin.myFriends.removeFriend'),
							postReject: () => {
								cacheInvalidation.refreshMyFriends();
								toasts.success(getTranslation('admin.myFriends.friendRemoved'));
							}
						}}
					/>
				{/if}
				{#if friendsSearch.length === 0 && $user.data !== null && friends !== null && friends.data.length === 0}
					<div class="no-data">{getTranslation('admin.myFriends.noFriends')}</div>
				{/if}
			</Content>
		</Panel>
	</Accordion>
</section>

<style>
	section {
		padding: 30px 50px;
	}
	.accordion-title {
		font-weight: bold;
	}
	.no-data {
		text-align: center;
		color: #888;
		font-style: italic;
	}
	.search-term {
		margin-bottom: 10px;
	}
</style>
