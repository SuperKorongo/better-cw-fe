<script lang="ts">
	import Radio from '@smui/radio';
	import FormField from '@smui/form-field';

	import * as toasts from '$lib/components/toasts/toasts';
	import { getTranslation } from '$lib/translations';
	import { videoForm } from '$lib/stores/video-form/store';

	let { price, visibility }: { visibility: 'private' | 'public'; price: number } = $props();

	const PUBLIC_OPTION = {
		name: getTranslation('upload.visibilityPublic'),
		disabled: false
	};
	const PRIVATE_OPTION = {
		name: getTranslation('upload.visibilityPrivate'),
		disabled: false
	};

	const options = $state([PUBLIC_OPTION, PRIVATE_OPTION]);
	let value = $derived(PUBLIC_OPTION.name);

	$effect.pre(() => {
		value = visibility === 'private' ? PRIVATE_OPTION.name : PUBLIC_OPTION.name;
	});

	$effect(() => {
		if (price > 0) {
			PRIVATE_OPTION.disabled = true;
			value = PUBLIC_OPTION.name;
			return;
		}
		PRIVATE_OPTION.disabled = false;
	});

	$effect(() => {
		console.log($videoForm.isPrivate);
	});
</script>

<div class="main-container">
	<div class="form-group">
		{#each options as option (option.name)}
			<FormField>
				<Radio
					onclick={(e: Event) => {
						if (price > 0 && option.name === PRIVATE_OPTION.name) {
							e.preventDefault();
							value = PUBLIC_OPTION.name;
							videoForm.setIsPrivate(false);
							toasts.warning(getTranslation('upload.cannotChangeToPrivate'));
							return;
						}

						videoForm.setIsPrivate(option.name === PRIVATE_OPTION.name);
					}}
					bind:group={value}
					value={option.name}
					disabled={option.disabled}
				/>
				{#snippet label()}
					{option.name}
				{/snippet}
			</FormField>
		{/each}
	</div>
	<span class="explanation">{getTranslation('upload.visibilityExplanation1')}</span>
	<span class="explanation">{getTranslation('upload.visibilityExplanation2')}</span>
</div>

<style>
	.explanation {
		color: #888;
		font-size: 13px;
		display: block;
	}
</style>
