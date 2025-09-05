<script lang="ts">
	import { goto } from '$app/navigation';
	import { Durations, Visibilities } from '$lib/models/Filters';
	import { language } from '$lib/stores/language/store';
	import { loading } from '$lib/stores/loading/store';
	import { filters, MAX_MAX_PRICE } from '$lib/stores/video_filters/store';
	import { getTranslation } from '$lib/translations';
	import { getSearchAndOrderAndFiltersQueryParams } from '$lib/utils/utils';
	import Button from '@smui/button';
	import Select, { Option } from '@smui/select';
	import Slider from '@smui/slider';
	import Textfield from '@smui/textfield';
	import { onMount } from 'svelte';

	let { text, minPrice, maxPrice, visibility, duration } = $derived($filters);

	const onApplyFilters = () => {
		filters.set({
			text,
			minPrice,
			maxPrice,
			visibility,
			duration
		});

		loading.set(true);
		goto(`/${$language}` + getSearchAndOrderAndFiltersQueryParams());
	};
	const onResetFilters = () => {
		filters.setEmpty();
		loading.set(true);
		goto(`/${$language}` + getSearchAndOrderAndFiltersQueryParams());
	};
	onMount(() => {
		loading.set(false);
	});
</script>

<div class="main">
	<div class="filter">
		<Textfield
			variant="outlined"
			style="width: 100%"
			bind:value={text}
			label={getTranslation('homepage.filters.searchTerm')}
			input$maxlength={255}
		/>
	</div>
	<div class="filter">
		<Select
			style="width:100%"
			bind:value={visibility}
			label={getTranslation('homepage.filters.visibility')}
		>
			{#each Visibilities as v}
				<Option value={v}>{getTranslation(`homepage.filters.visibility_${v}`)}</Option>
			{/each}
		</Select>
	</div>
	<div class="filter">
		<Select
			style="width:100%"
			bind:value={duration}
			label={getTranslation('homepage.filters.duration')}
		>
			{#each Durations as d}
				<Option value={d}>{getTranslation(`homepage.filters.duration_${d}`)}</Option>
			{/each}
		</Select>
	</div>
	<div class="filter">
		<span class="price-range-label">
			{#if minPrice == 0 && maxPrice == 0}
				{getTranslation('homepage.filters.freeOnly')}
			{:else}
				{getTranslation('homepage.filters.priceRange')
					.replace(
						'{MIN}',
						minPrice == 0 ? getTranslation('homepage.filters.free') : `$${minPrice}`
					)
					.replace(
						'{MAX}',
						maxPrice === MAX_MAX_PRICE
							? getTranslation('homepage.filters.anyPrice')
							: `$${maxPrice}`
					)}
			{/if}
		</span>
		<Slider
			range
			bind:start={minPrice}
			bind:end={maxPrice}
			min={0}
			max={MAX_MAX_PRICE}
			step={1}
			input$aria-label="Price slider"
		/>
	</div>

	<div class="buttons">
		<div>
			<Button onclick={onApplyFilters} variant="raised" color="primary">
				{getTranslation('homepage.filters.apply')}
			</Button>
		</div>
		<div>
			<Button onclick={onResetFilters} variant="outlined" color="secondary">
				{getTranslation('homepage.filters.reset')}
			</Button>
		</div>
	</div>
</div>

<style>
	.filter {
		margin-bottom: 20px;
	}
	.price-range-label {
		font-size: 13px;
		color: #888;
		font-style: italic;
		display: block;
		margin-bottom: -10px;
	}
	.buttons {
		text-align: right;
	}
	.buttons > div {
		display: inline;
		margin-right: 10px;
	}
</style>
