<script lang="ts">
	import { mdiArrowUp } from '@mdi/js';
	import { Cell, Label } from '@smui/data-table';
	import IconButton, { Icon } from '@smui/icon-button';

	let { columnId, label }: { columnId: string; label: string } = $props();
</script>

<Cell {columnId}>
	<Label>{label}</Label>
	<IconButton class="material-icons">
		<Icon tag="svg" viewBox="0 0 24 24" class="material-icons">
			<path fill="currentColor" d={mdiArrowUp} />
		</Icon>
	</IconButton>
</Cell>

<style>
</style>
