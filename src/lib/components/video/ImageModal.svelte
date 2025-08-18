<script lang="ts">
	import { getImageSrc } from '$lib/utils/utils';
	import CloseButton from './CloseButton.svelte';
	import Overlay from './Overlay.svelte';

	let {
		imageUrl,
		onClose
	}: {
		imageUrl: string;
		onClose: () => void;
	} = $props();
</script>

<Overlay onClick={onClose} />
<div>
	<div class="close-button-container">
		<CloseButton onClick={onClose} />
	</div>
	<img
		onload={(e) => {
			const img = e.target as HTMLImageElement;
			if (img.naturalWidth > img.naturalHeight) {
				img.style.width = '100%';
				img.style.marginLeft = '0%';
			} else {
				img.style.width = '50%';
				img.style.marginLeft = '25%';
			}
		}}
		src={getImageSrc(imageUrl)}
		alt={imageUrl}
	/>
</div>

<style>
	div {
		z-index: 4;
		position: fixed;
		top: 10%;
		left: 10%;
		width: 80%;
		height: 80%;
	}
	img {
		height: 100%;
	}

	.close-button-container {
		margin-top: -50px;
		margin-left: 50px;
	}
</style>
