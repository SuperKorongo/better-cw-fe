<script lang="ts">
	import type { Video } from '$lib/models/Video';
	import { language } from '$lib/stores/language/store';
	import { onClickInternalLink } from '$lib/utils/utils';

	let { uploader }: { uploader: Video['uploader'] } = $props();
</script>

<a
	data-sveltekit-preload-data="tap"
	onclick={onClickInternalLink}
	href={`/${$language}/users/${uploader.slug}`}
	class="uploader"
>
	{uploader.name}
</a>

<style>
	a:hover {
		color: #ddd;
		text-decoration: underline;
	}
</style>
