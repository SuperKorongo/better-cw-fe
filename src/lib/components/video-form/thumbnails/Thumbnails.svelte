<script lang="ts">
	import Landscape from '$lib/components/icons/Landscape.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import { getTranslation } from '$lib/translations';
	import { EMPTY_IMAGE_SRC } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { videoForm } from '../../../../stores/video-form/store';
	import Generator from './Generator.svelte';

	let { images, amountOfThumbnails }: { images: HTMLImageElement[]; amountOfThumbnails: number } =
		$props();
	let thumbnailImages: HTMLImageElement[] = $state([]);

	let imagesEditOverlay: HTMLDivElement[] = $state([]);
	let checksum: string = $state('');
	let fileInputs: HTMLInputElement[] = $state([]);

	for (const img of images) {
		thumbnailImages.push(img);
	}

	$effect.pre(() => {
		for (const [index, img] of images.entries()) {
			if (isPlaceholder(img)) {
				videoForm.setThumbnail(index, null);
				continue;
			}

			(function setBlob(i: number) {
				const phantomImage = document.createElement('img');
				phantomImage.setAttribute('src', img.src);
				phantomImage.setAttribute('crossOrigin', 'anonymous');
				phantomImage.onload = ({ target: img }) => {
					const imgElement = img as HTMLImageElement;

					const phantomCanvas = document.createElement('canvas');
					const ctx = phantomCanvas.getContext('2d');
					phantomCanvas.width = imgElement.naturalWidth;
					phantomCanvas.height = imgElement.naturalHeight;

					ctx?.drawImage(imgElement, 0, 0);
					phantomCanvas.toBlob((blob) => {
						if (blob === null) {
							videoForm.setThumbnail(i, null);
							return;
						}
						videoForm.setThumbnail(i, {
							blob,
							src: imgElement.src
						});
					});
				};
			})(index);
		}
	});

	const onClickThumbnail = (index: number) => {
		fileInputs[index].click();
	};

	const onClickRemoveThumbnail = (e: Event, index: number) => {
		e.stopPropagation();
		thumbnailImages[index].src = EMPTY_IMAGE_SRC;
		updateChecksum();

		videoForm.removeThumbnail(index);
	};

	function updateChecksum(): void {
		checksum = thumbnailImages.reduce((acc, i) => acc + i.src, '');
	}

	function isPlaceholder(image: HTMLImageElement): boolean {
		return image && image.src === EMPTY_IMAGE_SRC;
	}

	onMount(() => {
		fileInputs.forEach((input, index) => {
			input.onchange = () => {
				const file = input.files![0];
				if (file.size > 1000000) {
					toasts.error(getTranslation('upload.errors.tooBig'));
					return;
				}

				thumbnailImages[index].src = URL.createObjectURL(file);
				videoForm.setThumbnail(index, {
					blob: file,
					src: thumbnailImages[index].src
				});
				updateChecksum();
			};
		});
	});
</script>

<div class="main-container">
	<div class="thumbnails-container">
		{#each Array.from(Array(amountOfThumbnails).keys()) as i (i)}
			<div
				tabindex="-1"
				role="button"
				onkeypress={() => {}}
				onclick={() => {
					onClickThumbnail(i);
				}}
				class="thumbnail-container"
			>
				{#key checksum}
					{#if !isPlaceholder(thumbnailImages[i])}
						<button onclick={(e) => onClickRemoveThumbnail(e, i)} class="remove-thumbnail">
							X
						</button>
					{/if}
					<div
						style={isPlaceholder(thumbnailImages[i]) ? '' : 'display: none'}
						bind:this={imagesEditOverlay[i]}
						class="edit-overlay"
					>
						<div class="change-thumbnail-icon-container">
							<Landscape />
							<br />
							<span
								>{getTranslation(
									isPlaceholder(thumbnailImages[i])
										? 'upload.addThumbnail'
										: 'upload.changeThumbnail'
								)}</span
							>
						</div>
					</div>
				{/key}
				<img bind:this={thumbnailImages[i]} src={thumbnailImages[i].src} alt="" />
				<input
					accept="image/png, image/jpeg"
					bind:this={fileInputs[i]}
					type="file"
					style="display: none"
				/>
			</div>
		{/each}
	</div>
	<Generator
		onGenerate={(index: number, blob: Blob) => {
			videoForm.setThumbnail(index, {
				blob,
				src: URL.createObjectURL(blob)
			});
			updateChecksum();
		}}
		thumbnailImages={() => thumbnailImages}
	/>
</div>

<style>
	.main-container {
		max-width: 100%;
		overflow-x: hidden;
	}
	.thumbnails-container {
		cursor: pointer;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 320px));
		grid-template-rows: repeat(2, 150px);
		gap: 20px;
		justify-content: center;
		padding: 20px;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
	}
	.thumbnail-container {
		width: 100%;
		height: 150px;
		border: 2px dashed grey;
		position: relative;
	}
	.thumbnail-container:hover {
		border-color: black;
	}
	.thumbnail-container:hover > .edit-overlay {
		display: grid !important;
	}
	.thumbnail-container img {
		width: 100%;
		height: 100%;
	}
	.edit-overlay {
		display: grid;
		gap: 20px 100px;
		align-items: center;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		color: #eee;
		font-weight: bold;
		text-shadow: 1px 1px 1px black;
		text-align: center;
		background-color: rgba(128, 128, 128, 0.7);
	}

	.remove-thumbnail {
		position: absolute;
		border-radius: 50%;
		background-color: rgb(106, 0, 0);
		border: 1px solid #888;
		color: white;
		z-index: 1;
		padding: 2px 5px;
		text-shadow: 1px 1px 1px black;
		font-weight: bold;
		font-size: 10px;
		right: 0px;
		cursor: pointer;
		margin-top: -5px;
		margin-right: -5px;
	}

	@media (max-width: 1000px) {
		.thumbnails-container {
			grid-template-columns: repeat(2, 320px);
			grid-template-rows: repeat(3, 150px);
		}
	}

	@media (max-width: 680px) {
		.thumbnails-container {
			grid-template-columns: 320px;
			grid-template-rows: repeat(6, 150px);
		}
	}
</style>
