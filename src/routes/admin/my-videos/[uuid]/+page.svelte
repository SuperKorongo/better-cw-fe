<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as toasts from '$lib/components/toasts/toasts';
	import VideoForm from '$lib/components/video-form/VideoForm.svelte';
	import { getEmpty } from '$lib/models/Video';
	import { getUserVideoByUUID, type AdminVideo } from '$lib/services/admin/videos';
	import { onMount } from 'svelte';
	import { loading } from '../../../../stores/loading/store';
	import { getTranslation } from '../../../../translations';

	let video: AdminVideo = $state({
		...getEmpty(),
		downloadLink: '',
		downloadLinkInstructions: ''
	});

	onMount(async () => {
		const { uuid } = page.params as { uuid: string };

		try {
			video = await getUserVideoByUUID(window.fetch, uuid);
		} catch {
			toasts.error(getTranslation('common.errors.generic'));
			goto('/admin/my-videos/');
		} finally {
			loading.set(false);
		}
	});
</script>

<section>
	{#key video}
		<VideoForm type="patch" {video} />
	{/key}
</section>

<style>
</style>
