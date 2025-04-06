<script lang="ts">
	import * as toasts from '$lib/components/toasts/toasts';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { EMPTY_IMAGE_SRC } from '$lib/utils/utils';
	import Button from '@smui/button';
	import { onMount } from 'svelte';

	let {
		thumbnailImages,
		onGenerate
	}: {
		thumbnailImages: () => HTMLImageElement[];
		onGenerate: (index: number, blob: Blob) => void;
	} = $props();

	let inputFile: HTMLInputElement;
	let currentThumbnail = 0;
	let videoElement: HTMLVideoElement;
	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;

	onMount(setup);

	function setup(): void {
		canvas = document.createElement('canvas');
		canvas.width = 960;
		canvas.height = 540;
		canvasContext = canvas.getContext('2d')!;

		videoElement = document.createElement('video');

		videoElement.onloadedmetadata = async () => {
			let split = videoElement.duration / thumbnailImages().length;
			let currentTime = 0;
			for (let i = 0; i < thumbnailImages().length; i++) {
				currentTime += split;
				videoElement.currentTime = Math.trunc(currentTime);

				await new Promise<void>((resolve) => {
					setInterval(() => {
						if (i === currentThumbnail) {
							return;
						}
						resolve();
					}, 50);
				});
			}
			loading.set(false);
		};

		videoElement.onseeked = () => {
			canvasContext.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

			canvas.toBlob(async (blob: Blob | null) => {
				thumbnailImages()[currentThumbnail].src = URL.createObjectURL(blob!);
				onGenerate(currentThumbnail, blob!);
				currentThumbnail++;
			});
		};

		videoElement.onerror = () => {
			loading.set(false);
			for (const img of thumbnailImages()) {
				img.src = EMPTY_IMAGE_SRC;
			}
			toasts.error(getTranslation('upload.errors.cantGenerateThumbnails'), { duration: 99999899 });
		};
	}

	async function onChange(e: Event) {
		loading.set(true);

		currentThumbnail = 0;
		const file = (e.target as HTMLInputElement).files![0];

		videoElement.src = URL.createObjectURL(file);
	}
</script>

<div>
	<Button color="secondary" variant="raised" onclick={() => inputFile.click()}>
		{getTranslation('upload.generateThumbnails')}
	</Button>
	<input
		bind:this={inputFile}
		accept="video/mp4,video/x-m4v,video/mkv,video/x-matroska,video/avi,video/*"
		onchange={onChange}
		type="file"
		value=""
	/>
</div>

<style>
	input {
		display: none;
	}
</style>
