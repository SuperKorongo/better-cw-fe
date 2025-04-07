<script lang="ts">
	import type { Pagination } from '$lib/models/Pagination';
	import type { Withdrawal, WithdrawalsResponse } from '$lib/services/admin/withdrawals';
	import { getWithdrawals } from '$lib/services/admin/withdrawals';
	import { getFormattedDate } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	let withdrawals: Withdrawal[] = $state([]);
	let meta: WithdrawalsResponse['meta'] = $state({
		page: 1,
		totalPages: 1,
		totalItems: 0
	});

	const pagination: Pagination = $state({
		limit: 10,
		offset: 0,
		orderBy: {
			column: 'created_at',
			direction: 'desc'
		}
	});

	onMount(async () => {
		await loadWithdrawals();
	});

	async function loadWithdrawals() {
		try {
			const response = await getWithdrawals(pagination);
			withdrawals = response.data;
			meta = response.meta;
		} catch (error) {
			console.error('Error loading withdrawals:', error);
		}
	}

	async function handlePageChange(newPage: number) {
		pagination.offset = (newPage - 1) * pagination.limit;
		await loadWithdrawals();
	}

	function getStatus(withdrawal: Withdrawal): string {
		if (withdrawal.failureReason) {
			return 'Failed';
		}
		if (withdrawal.processedAtTimestamp) {
			return 'Processed';
		}
		return 'Pending';
	}
</script>

<div class="table-container">
	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>UUID</th>
				<th>Coin</th>
				<th>Amount</th>
				<th>Transaction</th>
				<th>Fee</th>
				<th>Created At</th>
				<th>Processed At</th>
				<th>Status</th>
				<th>Failure Reason</th>
			</tr>
		</thead>
		<tbody>
			{#each withdrawals as withdrawal}
				<tr>
					<td>{withdrawal.id}</td>
					<td>{withdrawal.uuid}</td>
					<td>{withdrawal.coin}</td>
					<td>{withdrawal.amount}</td>
					<td>{withdrawal.blockchainTransaction || '-'}</td>
					<td>{withdrawal.blockchainFee}</td>
					<td>{getFormattedDate(withdrawal.createdAtTimestamp)}</td>
					<td
						>{withdrawal.processedAtTimestamp
							? getFormattedDate(withdrawal.processedAtTimestamp)
							: '-'}</td
					>
					<td>{getStatus(withdrawal)}</td>
					<td>{withdrawal.failureReason || '-'}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="pagination">
		<button disabled={meta.page === 1} on:click={() => handlePageChange(meta.page - 1)}>
			Previous
		</button>
		<span>Page {meta.page} of {meta.totalPages}</span>
		<button
			disabled={meta.page === meta.totalPages}
			on:click={() => handlePageChange(meta.page + 1)}
		>
			Next
		</button>
	</div>
</div>

<style>
	.table-container {
		width: 100%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}

	th,
	td {
		padding: 12px;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}

	th {
		background-color: #f5f5f5;
		cursor: pointer;
	}

	th:hover {
		background-color: #e0e0e0;
	}

	tr:hover {
		background-color: #f5f5f5;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-top: 20px;
	}

	button {
		padding: 8px 16px;
		border: none;
		background-color: #f0f0f0;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button:hover:not(:disabled) {
		background-color: #e0e0e0;
	}
</style>
