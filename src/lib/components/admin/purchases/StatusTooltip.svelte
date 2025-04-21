<script lang="ts">
	import { getTranslation } from '$lib/translations';

	let tooltipVisible = $state(false);
</script>

<div class="tooltip-container">
	<div class="status-header">
		<span>{getTranslation('purchases.table.status')}</span>
		<button
			class="info-icon"
			onmouseenter={() => (tooltipVisible = true)}
			onmouseleave={() => (tooltipVisible = false)}
		>
			?
		</button>
	</div>
	{#if tooltipVisible}
		<div class="tooltip">
			<div class="status-row">
				<span class="status-label awaiting"
					>{getTranslation('purchases.status.awaitingBlockchain')}</span
				>
				<span class="status-description"
					>{getTranslation('purchases.status.descriptions.awaitingBlockchain')}</span
				>
			</div>
			<div class="status-row">
				<span class="status-label awaiting"
					>{getTranslation('purchases.status.awaitingConfirmation')}</span
				>
				<span class="status-description"
					>{getTranslation('purchases.status.descriptions.awaitingConfirmation')}</span
				>
			</div>
			<div class="status-row">
				<span class="status-label awaiting"
					>{getTranslation('purchases.status.awaitingFullFunds')}</span
				>
				<span class="status-description"
					>{getTranslation('purchases.status.descriptions.awaitingFullFunds')}</span
				>
			</div>
			<div class="status-row">
				<span class="status-label confirmed">{getTranslation('purchases.status.confirmed')}</span>
				<span class="status-description"
					>{getTranslation('purchases.status.descriptions.confirmed')}</span
				>
			</div>
			<div class="status-row">
				<span class="status-label expired">{getTranslation('purchases.status.expired')}</span>
				<span class="status-description"
					>{getTranslation('purchases.status.descriptions.expired')}</span
				>
			</div>
		</div>
	{/if}
</div>

<style>
	.tooltip-container {
		position: relative;
		display: inline-block;
		z-index: 1100;
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.info-icon {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #666;
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: bold;
	}

	.tooltip {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		background: white;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		z-index: 1100;
		width: 300px;
		margin-top: 0.5rem;
	}

	.status-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 0.75rem;
	}

	.status-row:last-child {
		margin-bottom: 0;
	}

	.status-label {
		font-weight: 500;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.9rem;
		display: inline-block;
		width: fit-content;
	}

	.status-description {
		color: #666;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.status-label.awaiting {
		background-color: #fff3cd;
		color: #856404;
	}

	.status-label.confirmed {
		background-color: #d4edda;
		color: #155724;
	}

	.status-label.expired {
		background-color: #f8d7da;
		color: #721c24;
	}

	/* Arrow */
	.tooltip::before {
		content: '';
		position: absolute;
		top: -6px;
		left: 50%;
		transform: translateX(-50%);
		border-width: 0 6px 6px 6px;
		border-style: solid;
		border-color: transparent transparent white transparent;
	}
</style>
