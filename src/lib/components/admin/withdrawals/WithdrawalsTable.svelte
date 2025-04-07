<script lang="ts">
	import type { Pagination } from '$lib/models/Pagination';
	import type { Withdrawal, WithdrawalsResponse } from '$lib/services/admin/withdrawals';
	import { getWithdrawals } from '$lib/services/admin/withdrawals';
	import { getTranslation } from '$lib/translations';
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
			return getTranslation('withdraw.status.failed');
		}
		if (withdrawal.processedAtTimestamp) {
			return getTranslation('withdraw.status.processed');
		}
		return getTranslation('withdraw.status.pending');
	}
</script>

<div class="table-container">
	<table>
		<thead>
			<tr>
				<th>{getTranslation('withdraw.table.uuid')}</th>
				<th>{getTranslation('withdraw.table.createdAt')}</th>
				<th>{getTranslation('withdraw.table.amount')}</th>
				<th>{getTranslation('withdraw.table.transaction')}</th>
				<th>{getTranslation('withdraw.table.fee')}</th>
				<th>{getTranslation('withdraw.table.processedAt')}</th>
				<th>{getTranslation('withdraw.table.status')}</th>
			</tr>
		</thead>
		<tbody>
			{#each withdrawals as withdrawal}
				<tr>
					<td>{withdrawal.uuid}</td>
					<td>{getFormattedDate(withdrawal.createdAtTimestamp)}</td>
					<td>{withdrawal.amount}</td>
					<td>
						{#if withdrawal.blockchainTransaction}
							<a
								href="https://mempool.space/tx/{withdrawal.blockchainTransaction}"
								target="_blank"
								rel="noopener noreferrer"
								class="transaction-link"
							>
								{withdrawal.blockchainTransaction}
							</a>
						{:else}
							-
						{/if}
					</td>
					<td>{withdrawal.blockchainFee}</td>
					<td
						>{withdrawal.processedAtTimestamp
							? getFormattedDate(withdrawal.processedAtTimestamp)
							: '-'}</td
					>
					<td>{getStatus(withdrawal)}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="pagination">
		<button disabled={meta.page === 1} onclick={() => handlePageChange(meta.page - 1)}>
			Previous
		</button>
		<span>Page {meta.page} of {meta.totalPages}</span>
		<button
			disabled={meta.page === meta.totalPages}
			onclick={() => handlePageChange(meta.page + 1)}
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

	tr:nth-child(even) {
		background-color: #fbfdfa;
	}

	tr:hover {
		background-color: #f0f0f0;
	}

	.transaction-link {
		color: #40c4ff;
		text-decoration: none;
		word-break: break-all;
	}

	.transaction-link:hover {
		text-decoration: underline;
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
