<script lang="ts">
	import {
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import {
		mdiArrowCollapseLeft,
		mdiArrowCollapseRight,
		mdiArrowLeft,
		mdiArrowRight
	} from '@mdi/js';
	import { Label, Pagination } from '@smui/data-table';
	import IconButton, { Icon } from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import { getTranslation } from '../../../translations';

	let {
		rowsPerPageOptions,
		pagination,
		meta,
		onFirstPage,
		onNextPage,
		onPreviousPage,
		onLastPage,
		onChangeRowsPerPage
	}: {
		rowsPerPageOptions: number[];
		pagination: PaginationType;
		meta: PaginatedResponse<unknown>['meta'];
		onFirstPage: () => void;
		onNextPage: () => void;
		onPreviousPage: () => void;
		onLastPage: () => void;
		onChangeRowsPerPage: (value: number) => void;
	} = $props();
</script>

<Pagination>
	{#snippet rowsPerPage()}
		<Label>{getTranslation('admin.myVideos.rowsPerPage')}</Label>
		<Select
			onSMUISelectChange={({ detail: { value } }) => {
				onChangeRowsPerPage(value);
			}}
			variant="outlined"
			value={pagination.limit}
			noLabel
		>
			{#each rowsPerPageOptions as rowsPerPage (rowsPerPage)}
				<Option value={rowsPerPage}>{rowsPerPage}</Option>
			{/each}
		</Select>
	{/snippet}
	{#snippet total()}
		{pagination.offset + 1}-{pagination.offset + pagination.limit}
		{getTranslation('admin.myVideos.of')}
		{meta.totalItems}
	{/snippet}

	<IconButton class="material-icons" onclick={onFirstPage} disabled={meta.page === 1}>
		<Icon tag="svg" viewBox="0 0 24 24" class="material-icons">
			<path fill="currentColor" d={mdiArrowCollapseLeft} />
		</Icon>
	</IconButton>
	<IconButton class="material-icons" onclick={onPreviousPage} disabled={meta.page === 1}>
		<Icon tag="svg" viewBox="0 0 24 24" class="material-icons">
			<path fill="currentColor" d={mdiArrowLeft} />
		</Icon>
	</IconButton>
	<IconButton class="material-icons" onclick={onNextPage} disabled={meta.page === meta.totalPages}>
		<Icon tag="svg" viewBox="0 0 24 24" class="material-icons">
			<path fill="currentColor" d={mdiArrowRight} />
		</Icon>
	</IconButton>
	<IconButton class="material-icons" onclick={onLastPage} disabled={meta.page === meta.totalPages}>
		<Icon tag="svg" viewBox="0 0 24 24" class="material-icons">
			<path fill="currentColor" d={mdiArrowCollapseRight} />
		</Icon>
	</IconButton>
</Pagination>

<style>
</style>
