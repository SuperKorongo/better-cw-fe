<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';

	import { videoForm } from '$lib/stores/video-form/store';
	import { getTranslation } from '$lib/translations';

	let { name }: { name: string } = $props();

	const onChange = () => {
		videoForm.setModel(name);
	};

	$effect.pre(onChange);
</script>

<div class="main-container">
	<Textfield input$maxlength={50} onchange={onChange} variant="outlined" bind:value={name}>
		{#snippet helper()}
			<HelperText persistent>{getTranslation('upload.modelDescription')}</HelperText>
		{/snippet}
	</Textfield>
</div>

<style>
</style>
