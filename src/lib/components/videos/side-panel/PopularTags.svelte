<script lang="ts">
	import { DEFAULT_PAGINATION } from '$lib/models/Pagination';
	import type { Tag } from '$lib/models/Video';
	import { getPopular } from '$lib/services/tags';
	import { getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	let tags: Tag[] = $state([]);

	onMount(async () => {
		tags = await getPopular(window.fetch, DEFAULT_PAGINATION);
	});
</script>

<div class="main">
	{#each $state.snapshot(tags) as tag (tag.name)}
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
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		color: white;
		text-shadow: 1px 1px 1px black;
		border-radius: 5px;
		padding: 2px 10px;
		margin-right: 5px;
		font-size: 14px;
		line-height: 30px;
		font-weight: bold;
		margin-bottom: 10px;
	}
</style>
