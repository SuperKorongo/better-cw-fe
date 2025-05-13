<script lang="ts">
	import StarRating from '$lib/components/common/StarRating.svelte';
	import type { Video } from '$lib/models/Video';
	import { getTranslation } from '$lib/translations';
	import { getDurationString, getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';
	import UploaderLink from '../../common/UploaderLink.svelte';

	let {
		video
	}: {
		video: Video;
	} = $props();
</script>

<span class="meta-label">
	{getTranslation('video.videoRating')}
</span>
<span class="meta-value">
	<StarRating value={video.rating} />
</span>

<span class="meta-label">
	{getTranslation('video.uploadedBy')}
</span>
<span class="meta-value">
	<UploaderLink uploader={video.uploader} />
</span>

<span class="meta-label">
	{getTranslation('video.modelName')}
</span>
{#if video.model}
	<a
		data-sveltekit-preload-data="tap"
		onclick={onClickInternalLink}
		href={getHrefWithLanguage(`/models/${video.model.slug}`)}
		class="meta-value"
	>
		{video.model.name}
	</a>
{:else}
	<span class="meta-value">-</span>
{/if}

<span class="meta-label">
	{getTranslation('video.duration')}
</span>
<span class="meta-value">{getDurationString(video.durationInSeconds)}</span>

<style>
	.meta-label {
		text-align: right;
		color: #aaa;
	}
	.meta-value {
		padding-left: 20px;
		text-align: left;
		font-weight: bold;
	}
	a:hover {
		color: #ddd;
		text-decoration: underline;
	}
</style>
