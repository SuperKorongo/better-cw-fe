<script lang="ts">
	import NoPurchases from '$lib/components/admin/purchases/NoPurchases.svelte';
	import PurchasesTable from '$lib/components/admin/purchases/PurchasesTable.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import {
		DEFAULT_PAGINATION,
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import { type Payment } from '$lib/models/Payment';
	import { getMyPayments } from '$lib/services/payments';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { onMount } from 'svelte';

	let data: PaginatedResponse<Payment> | null = $state(null);
	let pagination: PaginationType = $state({
		...structuredClone(DEFAULT_PAGINATION),
		limit: 10,
		orderBy: {
			column: 'created_at',
			direction: 'desc'
		}
	});
	let showPaidOnly = $state(false);

	onMount(async () => {
		await loadPayments();
	});

	async function loadPayments() {
		try {
			loading.set(true);
			const statusFilter = showPaidOnly ? [3] : undefined; // todo: map constants
			data = await getMyPayments(
				window.fetch,
				{
					...pagination
				},
				statusFilter
			);
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
		} finally {
			loading.set(false);
		}
	}

	function handlePaginationChange(newPagination: PaginationType) {
		pagination = newPagination;
		loadPayments();
	}

	function handleStatusFilterChange(newShowPaidOnly: boolean) {
		showPaidOnly = newShowPaidOnly;
		loadPayments();
	}
</script>

<section>
	{#if data !== null && data.data.length > 0}
		<h1>{getTranslation('purchases.title')}</h1>
		<PurchasesTable
			{data}
			{pagination}
			{showPaidOnly}
			onChangePagination={handlePaginationChange}
			onChangeStatusFilter={handleStatusFilterChange}
		/>
	{:else if data !== null && data.data.length === 0}
		<NoPurchases />
	{/if}
</section>

<style>
	section {
		padding: 30px 50px;
	}

	h1 {
		margin-bottom: 2rem;
		font-size: 1.5rem;
		color: #333;
	}
</style>
