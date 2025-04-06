<script lang="ts">
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
	import HelperText from '@smui/textfield/helper-text';

	import { MEGA_PREFIX } from '$lib/services/videos';
	import { videoForm } from '../../../../stores/video-form/store';
	import { getTranslation } from '../../../../translations';

	const MAX_LENGTH: number = 255;

	let {
		link,
		instructions
	}: {
		link: string;
		instructions: string;
	} = $props();

	$effect.pre(() => {
		videoForm.setDownloadLink(link);
		videoForm.setDownloadLinkInstructions(instructions);
	});

	let isValidLink: boolean = $state(true);

	const onChangeDownloadLink = async () => {
		link = link.replace(MEGA_PREFIX, '');
		videoForm.setDownloadLink(link);

		if (!link) {
			return;
		}

		const response = await fetch('https://g.api.mega.co.nz/cs', {
			method: 'POST',
			body: JSON.stringify([
				{
					a: 'g',
					ad: 1,
					p: link.split('#')[0]
				}
			])
		});

		if (!response.ok) {
			return;
		}

		const responseJson = await response.json();
		isValidLink = typeof responseJson[0] === 'object';

		if (!isValidLink) {
			videoForm.setDownloadLink('');
		}
	};

	const onChangeInstructions = () => {
		videoForm.setDownloadLinkInstructions(instructions);
	};
</script>

<div class="main-container">
	<div class="title">
		<Textfield
			invalid={!isValidLink}
			onchange={onChangeDownloadLink}
			prefix={MEGA_PREFIX}
			variant="outlined"
			style="width: 100%"
			bind:value={link}
		/>
	</div>
	<div class="description">
		<Textfield
			onchange={onChangeInstructions}
			invalid={instructions.length > MAX_LENGTH}
			label={getTranslation('upload.downloadLinkInstructionsShortLabel')}
			textarea
			style="width: 100%"
			bind:value={instructions}
			input$rows={1}
			input$maxlength={MAX_LENGTH}
		>
			{#snippet helper()}
				<HelperText persistent>{getTranslation('upload.downloadLinkInstructionsLabel')}</HelperText>
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
