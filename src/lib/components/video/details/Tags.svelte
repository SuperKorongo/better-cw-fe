<script lang="ts">
	import type { Video } from '$lib/models/Video';
	import { onClickInternalLink } from '$lib/utils/utils';

	let {
		tags
	}: {
		tags: Video['tags'];
	} = $props();

	const getFormattedTag = (tag: string): string => `#${tag} `; // Trailing space is important for beautiful text wrapping on smaller devices.
</script>

<div class="tags">
	{#each tags as tag (tag.name)}
		<a
			onclick={onClickInternalLink}
			class="tag"
			data-sveltekit-preload-data="tap"
			href={`/tags/${tag.slug}`}
		>
			{getFormattedTag(tag.name)}
		</a>
	{/each}
</div>

<style>
	.tag {
		background: rgba(0, 0, 0, 0.5);
		border-radius: 5px;
		padding: 5px 7px;
		padding-left: 9px;
		margin-right: 5px;
		color: #eee;
		font-size: 14px;
		line-height: 30px;
	}
</style>
