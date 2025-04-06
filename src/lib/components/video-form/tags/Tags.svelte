<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { videoForm } from '$lib/stores/video-form/store';
	import { getTranslation } from '$lib/translations';
	// @ts-expect-error - Missing TS declarations.
	import Tags from 'svelte-tags-input';

	const MAX_TAGS = 30;
	const MIN_TAG_LENGTH = 2;
	const MAX_TAG_LENGTH = 50;

	let { tags }: { tags: string[] } = $props();
	let tagsValue = $state(Array.from(tags));

	$effect.pre(() => {
		videoForm.setTags(tags);
	});

	const onTagAdded = (tag: string): void => {
		if (tag.length < MIN_TAG_LENGTH || tag.length > MAX_TAG_LENGTH) {
			tagsValue.pop();
			return;
		}

		if (tagsValue.length > MAX_TAGS) {
			if ($videoForm.tags.length > MAX_TAGS) {
				$videoForm.tags.pop();
			}
			tagsValue = Array.from($videoForm.tags);

			toasts.error(getTranslation('videoForm.errors.maxTags'));
			return;
		}

		videoForm.setTags(tagsValue);
	};

	const onTagRemoved = (_: string, tags: string[]): void => {
		videoForm.setTags(Array.from(tags));
	};
</script>

<div>
	<Tags
		placeholder={getTranslation('upload.tagsPlaceholder')}
		bind:tags={tagsValue}
		onlyUnique={true}
		{onTagAdded}
		{onTagRemoved}
	/>
</div>

<style>
</style>
