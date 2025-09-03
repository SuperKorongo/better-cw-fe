<script lang="ts">
	import NoVideos from '$lib/components/admin/videos/NoVideos.svelte';
	import VideosTable from '$lib/components/admin/videos/VideosTable.svelte';
	import {
		DEFAULT_PAGINATION,
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import type { AdminListVideo } from '$lib/models/Video';
	import { getUserVideos } from '$lib/services/admin/videos';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { handleApiError } from '$lib/utils/utils';

	let data: PaginatedResponse<AdminListVideo> | null = $state(null);
	let pagination: PaginationType = $state({
		...structuredClone(DEFAULT_PAGINATION),
		limit: 10
	});

	$effect(() => {
		if (!$user.ready || $user.data === null) {
			return;
		}

		loading.set(true);
		getUserVideos(window.fetch, pagination)
			.then((r) => {
				data = r;
			})
			.catch(handleApiError)
			.finally(() => loading.set(false));
	});
</script>

<section>
	{#if $user.data !== null && data !== null && data.data.length > 0}
		<span class="table-info">{getTranslation('admin.myVideos.info')}</span>
		<VideosTable
			{data}
			{pagination}
			onChangePagination={(newPagination) => {
				pagination = newPagination;
			}}
		/>
	{/if}
	{#if $user.data !== null && data !== null && data.data.length === 0}
		<NoVideos />
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}
	.table-info {
		color: #888;
		font-size: 13px;
		display: block;
		margin-bottom: 10px;
		text-align: right;
	}
</style>
