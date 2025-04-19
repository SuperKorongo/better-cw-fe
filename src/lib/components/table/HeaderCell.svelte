<script lang="ts">
	import { mdiArrowUp } from '@mdi/js';
	import { Cell, Label } from '@smui/data-table';
	import IconButton, { Icon } from '@smui/icon-button';

	let { columnId, label, sortable }: { columnId: string; label: string, sortable?: boolean } = $props();
</script>

<Cell {columnId}>
	<Label>{label}</Label>
	{#if sortable}
		<IconButton class="material-icons">
			<Icon tag="svg" viewBox="0 0 24 24" class="material-icons">
				<path fill="currentColor" d={mdiArrowUp} />
			</Icon>
		</IconButton>
		<IconButton class="material-icons">
			<Icon tag="svg" viewBox="0 0 24 24" class="material-icons">
				<path fill="currentColor" d={mdiArrowUp} />
			</Icon>
		</IconButton>
	{/if}
</Cell>

<style>
</style>
