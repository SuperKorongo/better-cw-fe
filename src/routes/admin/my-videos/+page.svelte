<script lang="ts">
	import NoVideos from '$lib/components/admin/videos/NoVideos.svelte';
	import VideosTable from '$lib/components/admin/videos/VideosTable.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import {
		DEFAULT_PAGINATION,
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import type { AdminListVideo } from '$lib/models/Video';
	import { getUserVideos } from '$lib/services/admin/videos';
	import { getTranslation } from '$lib/translations';
	import { loading } from '../../../stores/loading/store';
	import { user } from '../../../stores/user/store';

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
		getUserVideos(window.fetch, pagination, '')
			.then((r) => {
				data = r;
			})
			.catch(() => toasts.error(getTranslation('common.errors.generic')))
			.finally(() => loading.set(false));
	});
</script>

<section>
	{#if $user.data !== null && data !== null && data.data.length > 0}
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
</style>
