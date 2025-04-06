<script lang="ts">
	import { goto } from '$app/navigation';
	import type { OrderBy } from '$lib/models/Pagination';
	import { orderBy } from '$lib/stores/order_by/store';
	import { getTranslation } from '$lib/translations';
	import { getSearchAndOrderQueryParams } from '$lib/utils/utils';
	import Select, { Option } from '@smui/select';
	import { onMount } from 'svelte';
	import { ORDER_BYS } from './order_bys';

	let mounted: boolean = $state(false);
	let initialValue = `${$orderBy.column}|${$orderBy.direction}`;
	let value: string = $state(initialValue);
	onMount(() => {
		mounted = true;
		orderBy.init();

		setTimeout(() => {
			value = `${$orderBy.column}|${$orderBy.direction}`;
		}, 500);
	});

	$effect(() => {
		if (value === initialValue) {
			initialValue = '';
			return;
		}

		const [column, direction] = value.split('|');
		orderBy.set({
			column: column as OrderBy['column'],
			direction: direction as OrderBy['direction']
		});

		goto(getSearchAndOrderQueryParams());
	});
</script>

<div class="container">
	{#if mounted}
		{#key $orderBy}
			<Select bind:value label={getTranslation('common.orderBy.label')}>
				{#each ORDER_BYS as orderByOption (orderByOption.value)}
					<Option value={orderByOption.value}>{orderByOption.label}</Option>
				{/each}
			</Select>
		{/key}
	{/if}
</div>

<style>
	.container {
		padding-left: 10px;
		margin-bottom: 5px;
		height: 50px;
	}

	.container :global(.mdc-floating-label) {
		color: #ddd;
		font-weight: bold;
		font-size: 12px;
	}
	.container :global(.mdc-select__selected-text) {
		color: #ddd;
		font-size: 13px;
	}
	.container :global(.mdc-select__dropdown-icon-graphic) {
		fill: none;
	}
	.container :global(.mdc-select) {
		width: 250px;
	}
</style>
