<script lang="ts">
	import type { AdminVideo } from '$lib/services/admin/videos';
	import { videoForm } from '$lib/stores/video-form/store';
	import { getTranslation } from '$lib/translations';
	import { EMPTY_IMAGE_SRC, getImageSrc } from '$lib/utils/utils';
	import DownloadLink from './download-link/DownloadLink.svelte';
	import Duration from './duration/Duration.svelte';
	import Model from './model/Model.svelte';
	import Price from './price/Price.svelte';
	import Tags from './tags/Tags.svelte';
	import Thumbnails from './thumbnails/Thumbnails.svelte';
	import TitleAndDescription from './title-and-description/TitleAndDescription.svelte';
	import UploadButton from './upload-button/UploadButton.svelte';
	import Visibility from './visibility/Visibility.svelte';

	const AMOUNT_OF_THUMBNAILS = 6;

	let { video, type }: { video: AdminVideo; type: 'upload' | 'patch' } = $props();

	$effect.pre(videoForm.init);

	const getThumbnailImages = (): HTMLImageElement[] => {
		const images: HTMLImageElement[] = [];

		for (const path of video.thumbnailFilePaths) {
			const imgElement = document.createElement('img');
			imgElement.setAttribute('src', getImageSrc(path));
			images.push(imgElement);
		}

		for (let i = images.length; i < AMOUNT_OF_THUMBNAILS; i++) {
			const imgElement = document.createElement('img');
			imgElement.setAttribute('src', EMPTY_IMAGE_SRC);
			images.push(imgElement);
		}

		return images;
	};
</script>

<section class="main-section">
	<section class="thumbnails">
		<h1>{getTranslation('upload.titleAndDescription')}</h1>
		<TitleAndDescription title={video.title ?? ''} description={video.description ?? ''} />
	</section>
	<section class="download-link">
		<h1>{getTranslation('upload.downloadLink')}</h1>
		<DownloadLink
			link={video.downloadLink ?? ''}
			instructions={video.downloadLinkInstructions ?? ''}
		/>
	</section>
	<section class="thumbnails">
		<h1>{getTranslation('upload.thumbnails')}</h1>
		<Thumbnails amountOfThumbnails={AMOUNT_OF_THUMBNAILS} images={getThumbnailImages()} />
	</section>
	<section class="duration">
		<h1>{getTranslation('upload.duration')}</h1>
		<Duration durationInSeconds={video.durationInSeconds} />
	</section>
	<section class="model">
		<h1>{getTranslation('upload.model')}</h1>
		<Model name={video.model ? video.model.name : ''} />
	</section>
	<section class="tags">
		<h1>{getTranslation('upload.tags')}</h1>
		<Tags tags={video.tags.map((t) => t.name)} />
	</section>
	<section class="price">
		<h1>{getTranslation('upload.price')}</h1>
		<Price price={video.price.value.toString()} />
	</section>
	<section class="visibility">
		<h1>{getTranslation('upload.visibility')}</h1>
		<Visibility visibility={video.isPrivate ? 'private' : 'public'} price={$videoForm.priceInCentsOfDollar} />
	</section>
	<section class="upload-button">
		<UploadButton {type} {video} />
	</section>
</section>

<style>
	.main-section {
		padding: 40px 0px;
	}
	.main-section > section {
		margin-bottom: 40px;
		padding: 0px 50px;
	}
	.main-section > section > h1 {
		margin-left: -15px;
		margin-bottom: 15px;
		font-size: 20px;
		font-weight: bold;
	}
</style>
