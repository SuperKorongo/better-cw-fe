<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import Button, { Label } from '@smui/button';
	import Dialog, { Content, Title } from '@smui/dialog';

	let { instructions = '', open = $bindable() }: { instructions: string; open: boolean } = $props();
</script>

<Dialog
	bind:open
	aria-labelledby="download-instructions-title"
	surface$style="width: 500px; max-width: calc(100vw - 32px);"
>
	<Title id="download-instructions-title"
		>{getTranslation('common.downloadInstructions.title')}</Title
	>
	<Content>
		<div class="modal-content">
			<p class="instructions">{instructions}</p>
			<Button onclick={() => (open = false)} variant="outlined">
				<Label>{getTranslation('common.close')}</Label>
			</Button>
		</div>
	</Content>
</Dialog>

<style>
	.instructions {
		white-space: pre-wrap;
		margin: 16px 0;
		line-height: 1.5;
	}
</style>
