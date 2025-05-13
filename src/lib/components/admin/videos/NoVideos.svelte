<script lang="ts">
	import GlowingText from '$lib/components/common/GlowingText.svelte';
	import { getTranslation } from '$lib/translations';
	import { getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';
	import Button from '@smui/button';

	const title = getTranslation('admin.myVideos.noVideos.title');
	const description = getTranslation('admin.myVideos.noVideos.description');
	const cta = getTranslation('admin.myVideos.noVideos.cta');
</script>

<div class="no-videos-container">
	<h1>
		<GlowingText text={title} />
	</h1>
	<p class="description">{description}</p>
	<a
		onclick={onClickInternalLink}
		data-sveltekit-preload-data="hover"
		href={getHrefWithLanguage(`/upload`)}
	>
		<Button variant="raised" color="primary">{cta}</Button>
	</a>
</div>

<style>
	h1 {
		font-size: 30px;
	}
	.no-videos-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40px;
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.description {
		font-size: 16px;
		line-height: 1.5;
		color: #666;
		margin-bottom: 30px;
	}
</style>
