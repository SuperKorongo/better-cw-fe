<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { getTranslation } from '$lib/translations';
	// @ts-expect-error - Missing TS declarations.
	import Tags from 'svelte-tags-input';
	import { videoForm } from '../../../../stores/video-form/store';

	const MAX_TAGS = 30;
	const MIN_TAG_LENGTH = 2;
	const MAX_TAG_LENGTH = 50;

	let { tags }: { tags: string[] } = $props();

	$effect.pre(() => {
		videoForm.setTags(tags);
	});

	const onTagAdded = (tag: string): void => {
		if (tag.length < MIN_TAG_LENGTH || tag.length > MAX_TAG_LENGTH) {
			tags.pop();
			return;
		}

		if (tags.length > MAX_TAGS) {
			if ($videoForm.tags.length > MAX_TAGS) {
				$videoForm.tags.pop();
			}
			tags = Array.from($videoForm.tags);

			toasts.error(getTranslation('videoForm.errors.maxTags'));
			return;
		}

		videoForm.setTags(tags);
	};

	const onTagRemoved = (_: string, tags: string[]): void => {
		videoForm.setTags(Array.from(tags));
	};
</script>

<div>
	<Tags
		placeholder={getTranslation('upload.tagsPlaceholder')}
		bind:tags
		onlyUnique={true}
		{onTagAdded}
		{onTagRemoved}
	/>
</div>

<style>
</style>
