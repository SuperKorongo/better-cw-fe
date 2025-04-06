<script lang="ts">
	import HeartRating from '$lib/components/common/HeartRating.svelte';
	import type { Video } from '$lib/models/Video';
	import { getDurationString, getFormattedDate, onClickInternalLink } from '$lib/utils/utils';
	import { getTranslation } from '../../../../translations';
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
	<HeartRating totalRatings={video.totalRatings} value={video.rating} />
</span>

<span class="meta-label">
	{getTranslation('video.uploadedAt')}
</span>
<span class="meta-value">{getFormattedDate(video.uploadedAtTimestamp)}</span>

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
		href={`/models/${video.model.name}`}
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
