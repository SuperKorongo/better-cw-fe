<script lang="ts">
	import type { Tag } from '$lib/models/Video';
	import { getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';

	let { tags }: { tags: Tag[] } = $props();
</script>

<div class="main">
	{#each tags as tag (tag.name)}
		<a
			onclick={onClickInternalLink}
			class="tag"
			data-sveltekit-preload-data="tap"
			href={getHrefWithLanguage(`/tags/${tag.slug}`)}
		>
			{`#${tag.name}`}
		</a>
	{/each}
</div>

<style>
	.tag {
		display: inline-block;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 5px;
		padding: 2px 10px;
		margin-right: 5px;
		color: #eee;
		font-size: 14px;
		line-height: 30px;
		font-weight: bold;
		margin-bottom: 10px;
	}
</style>
