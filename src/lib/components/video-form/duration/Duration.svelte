<script lang="ts">
	import { videoForm } from '$lib/stores/video-form/store';
	import { getTranslation } from '$lib/translations';
	import Textfield from '@smui/textfield';

	const INPUT_WIDTH = '170px';

	let { durationInSeconds }: { durationInSeconds: number } = $props();

	let hours: number = $state(0);
	let minutes: number = $state(0);
	let seconds: number = $state(0);

	$effect.pre(() => {
		videoForm.setDurationInSeconds(durationInSeconds);

		hours = Math.floor(durationInSeconds / 3600);
		minutes = Math.floor((durationInSeconds % 3600) / 60);
		seconds = durationInSeconds % 60;
	});

	$effect(() => {
		videoForm.setDurationInSeconds(hours * 60 * 60 + minutes * 60 + seconds);
	});
</script>

<div class="main-container">
	<Textfield
		type="number"
		input$step={1}
		input$max={10}
		input$min={0}
		style={`width: ${INPUT_WIDTH}`}
		suffix={getTranslation('upload.hours')}
		variant="outlined"
		bind:value={hours}
	/>
	<Textfield
		type="number"
		input$step={1}
		input$max={59}
		input$min={0}
		input$maxlength={2}
		style={`width: ${INPUT_WIDTH}`}
		suffix={getTranslation('upload.minutes')}
		variant="outlined"
		bind:value={minutes}
	/>
	<Textfield
		type="number"
		input$maxlength={2}
		input$max={59}
		input$min={0}
		style={`width: ${INPUT_WIDTH}`}
		suffix={getTranslation('upload.seconds')}
		variant="outlined"
		bind:value={seconds}
	/>
</div>

<style>
</style>
