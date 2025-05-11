<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import type { Video } from '$lib/models/Video';
	import { patch } from '$lib/services/admin/videos';
	import { upload } from '$lib/services/videos';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { loading } from '$lib/stores/loading/store';
	import { videoForm } from '$lib/stores/video-form/store';
	import { getTranslation } from '$lib/translations';
	import { goToInternalLink, handleApiError } from '$lib/utils/utils';
	import Button from '@smui/button';
	import { patchThumbnails } from './patchThumbnails';

	let { type, video }: { type: 'upload' | 'patch'; video?: Video } = $props();

	let buttonLabel =
		type === 'upload' ? getTranslation('upload.uploadButton') : getTranslation('upload.editButton');

	let disclaimer =
		type === 'upload'
			? getTranslation('upload.disclaimer')
			: getTranslation('upload.editDisclaimer');

	const onClick = async (e: MouseEvent) => {
		if ($loading.value) {
			return;
		}

		if (!$videoForm.title) {
			toasts.error(getTranslation('upload.errors.emptyTitle'));
			return;
		}

		if (!$videoForm.downloadLink) {
			toasts.error(getTranslation('upload.errors.emptyDownloadLink'));
			return;
		}

		if (!$videoForm.thumbnails.length || !$videoForm.thumbnails.filter((b) => b !== null).length) {
			toasts.error(getTranslation('upload.errors.missingThumbnail'));
			return;
		}

		if ($videoForm.priceInCentsOfDollar <= 99) {
			toasts.error(getTranslation('upload.errors.emptyPrice'));
			return;
		}

		if ($videoForm.priceInCentsOfDollar > 100000000) {
			toasts.error(getTranslation('upload.errors.maxPrice'));
			return;
		}

		if ($videoForm.durationInSeconds <= 0) {
			toasts.error(getTranslation('upload.errors.emptyDuration'));
			return;
		}

		try {
			loading.set(true);

			switch (type) {
				case 'upload':
					await upload($videoForm);
					toasts.success(getTranslation('upload.successfulUpload'));
					break;
				case 'patch':
					await patch(video!.uuid, $videoForm);
					patchThumbnails(video!);

					toasts.success(getTranslation('admin.myVideos.editedSuccessfully'));
					break;
			}

			cacheInvalidation.refreshMyVideos();
			goToInternalLink(e, '/admin/my-videos');
		} catch (e: unknown) {
			const funcMap = new Map<number, () => void>();

			funcMap.set(409, () => {
				toasts.error(getTranslation('upload.errors.linkAlreadyUsed'));
			});

			handleApiError(e, 'upload.errors.genericServerError', funcMap);
		} finally {
			loading.set(false);
		}
	};
</script>

<div class="main-container">
	<Button onclick={onClick} variant="raised">{buttonLabel}</Button>
	<span class="disclaimer">{disclaimer}</span>
</div>

<style>
	.disclaimer {
		display: block;
		font-size: 13px;
		color: gray;
		margin-top: 10px;
	}
</style>
