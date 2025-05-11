<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import VideoForm from '$lib/components/video-form/VideoForm.svelte';
	import { getEmpty } from '$lib/models/Video';
	import { getUserVideoByUUID, type AdminVideo } from '$lib/services/admin/videos';
	import { language } from '$lib/stores/language/store';
	import { loading } from '$lib/stores/loading/store';
	import { handleApiError } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	let video: AdminVideo = $state({
		...getEmpty(),
		downloadLink: '',
		downloadLinkInstructions: ''
	});

	onMount(async () => {
		const { uuid } = page.params as { uuid: string };

		try {
			video = await getUserVideoByUUID(window.fetch, uuid);
		} catch (e: unknown) {
			handleApiError(e);
			goto(`${$language}/admin/my-videos`);
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
