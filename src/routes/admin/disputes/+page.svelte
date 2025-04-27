<script lang="ts">
	import DisputesTable from '$lib/components/admin/disputes/DisputesTable.svelte';
	import NoDisputes from '$lib/components/admin/disputes/NoDisputes.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import { DISPUTE_STATUS_MAP, OPEN_DISPUTE_STATUS, type Dispute } from '$lib/models/Dispute';
	import {
		DEFAULT_PAGINATION,
		type PaginatedResponse,
		type Pagination as PaginationType
	} from '$lib/models/Pagination';
	import { getDisputes } from '$lib/services/admin/disputes';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { ifNotLoading } from '$lib/utils/utils';
	import FormField from '@smui/form-field';
	import Switch from '@smui/switch';
	import { onMount } from 'svelte';

	let disputesAsBuyer: PaginatedResponse<Dispute> | null = $state(null);
	let disputesAsSeller: PaginatedResponse<Dispute> | null = $state(null);

	let initialPagination: PaginationType = {
		...structuredClone(DEFAULT_PAGINATION),
		limit: 10,
		orderBy: {
			column: 'updated_at',
			direction: 'desc'
		}
	};

	let disputesAsBuyerPagination: PaginationType = $state({ ...structuredClone(initialPagination) });
	let disputesAsSellerPagination: PaginationType = $state({
		...structuredClone(initialPagination)
	});

	let showOnlyOpenDisputes = $state(true);

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		[disputesAsBuyer, disputesAsSeller] = await Promise.all([
			fetchDisputes('buyer', disputesAsBuyerPagination),
			fetchDisputes('seller', disputesAsSellerPagination)
		]);
	}

	async function fetchDisputes(
		asWho: 'buyer' | 'seller',
		pagination: PaginationType
	): Promise<PaginatedResponse<Dispute> | null> {
		try {
			loading.set(true);
			const statusFilter = showOnlyOpenDisputes ? [DISPUTE_STATUS_MAP[OPEN_DISPUTE_STATUS]] : [];
			return await getDisputes(window.fetch, asWho, pagination, statusFilter);
		} catch (e: any) {
			console.log(e);

			toasts.error(getTranslation('common.errors.generic'));
		} finally {
			loading.set(false);
		}
		return null;
	}

	function handleStatusFilterChange(value: boolean) {
		showOnlyOpenDisputes = value;
		loadData();
	}

	async function handleBuyerPaginationChange(newPagination: PaginationType) {
		disputesAsBuyerPagination = newPagination;
		disputesAsBuyer = await fetchDisputes('buyer', disputesAsBuyerPagination);
	}

	async function handleSellerPaginationChange(newPagination: PaginationType) {
		disputesAsSellerPagination = newPagination;
		disputesAsSeller = await fetchDisputes('seller', disputesAsSellerPagination);
	}
</script>

<section>
	<div>
		<div class="filters">
			<FormField align="end">
				<Switch
					checked={showOnlyOpenDisputes}
					onclick={() => {
						ifNotLoading(() => {
							handleStatusFilterChange(!showOnlyOpenDisputes);
						});
					}}
				/>
				<span>{getTranslation('disputes.table.showOnlyOpen')}</span>
			</FormField>
		</div>
		<h1>{getTranslation('disputes.buyerTitle')}</h1>
		{#if disputesAsBuyer !== null && disputesAsBuyer.data.length > 0}
			<DisputesTable
				data={disputesAsBuyer}
				pagination={disputesAsBuyerPagination}
				onChangePagination={handleBuyerPaginationChange}
			/>
		{:else if disputesAsBuyer !== null && disputesAsBuyer.data.length === 0}
			<NoDisputes />
		{/if}
		<div>
			<h1>{getTranslation('disputes.sellerTitle')}</h1>
			{#if disputesAsSeller !== null && disputesAsSeller.data.length > 0}
				<DisputesTable
					data={disputesAsSeller}
					pagination={disputesAsSellerPagination}
					onChangePagination={handleSellerPaginationChange}
				/>
			{:else if disputesAsSeller !== null && disputesAsSeller.data.length === 0}
				<NoDisputes />
			{/if}
		</div>
	</div>
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

	.filters {
		margin-bottom: 1rem;
	}
</style>
