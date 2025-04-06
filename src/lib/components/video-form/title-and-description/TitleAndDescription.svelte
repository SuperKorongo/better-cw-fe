<script lang="ts">
	import { videoForm } from '$lib/stores/video-form/store';
	import { getTranslation } from '$lib/translations';
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
	import { onMount } from 'svelte';

	const MAX_TITLE_LENGTH: number = 255;
	const MAX_DESCRIPTION_LENGTH: number = 500;

	let titleField: unknown;

	let {
		title,
		description
	}: {
		title: string;
		description: string;
	} = $props();

	$effect(() => {
		videoForm.setTitle(title);
		videoForm.setDescription(description);
	});

	onMount(() => {
		(titleField as { getElement: () => { click: () => void } }).getElement().click();
	});
</script>

<div class="main-container">
	<div class="title">
		<Textfield
			bind:this={titleField}
			variant="outlined"
			invalid={title.length > MAX_TITLE_LENGTH}
			style="width: 100%"
			bind:value={title}
			label={getTranslation('upload.titleLabel')}
			input$maxlength={MAX_TITLE_LENGTH}
		>
			{#snippet helper()}
				<CharacterCounter />
			{/snippet}
		</Textfield>
	</div>
	<div class="description">
		<Textfield
			invalid={description.length > MAX_DESCRIPTION_LENGTH}
			textarea
			style="width: 100%"
			bind:value={description}
			label={getTranslation('upload.descriptionLabel')}
			input$rows={4}
			input$maxlength={MAX_DESCRIPTION_LENGTH}
		>
			{#snippet helper()}
				<CharacterCounter />
			{/snippet}
		</Textfield>
	</div>
</div>

<style>
	.title {
		margin-bottom: 20px;
	}
</style>
